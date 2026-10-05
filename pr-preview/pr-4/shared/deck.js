/* KD402D deck runtime
   Load at the end of <body>, after the slides:
     <script src="../shared/deck.js"></script>
   Page conventions:
     <body data-lecture="functions">              storage namespace for this lecture
     <main id="stage"><div id="deck"> slides </div></main>
     <section class="slide" id="…" data-sec="…">  one slide; id becomes its #link
       data-ex="Name"    marks a "Your turn" exercise (E jumps between them)
       data-demo="Name"  marks a "Try it" demo
       <aside class="nt">speaker notes</aside>
   Exposes window.Deck with helpers for the lecture's own script. */
(function(){
"use strict";
var COURSE="kd402d";
var LECTURE=document.body.dataset.lecture||"lecture";
var HOME=document.body.dataset.home||"../";

/* ============ helpers ============ */
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

var KW={"function":1,"return":1,"const":1,"let":1,"var":1,"if":1,"else":1,"for":1,"while":1,"of":1,"new":1,"true":1,"false":1,"null":1,"undefined":1,"typeof":1};
/* Syntax-highlight a JavaScript snippet; returns HTML. */
function hl(src){
  var re=/(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g,out="",last=0,m;
  while((m=re.exec(src))){
    out+=esc(src.slice(last,m.index));
    var c;
    if(m[1])c="c";else if(m[2])c="s";else if(m[3])c="n";
    else{ if(KW[m[4]])c="k"; else if(/^\s*\(/.test(src.slice(re.lastIndex)))c="fn"; else c="pl"; }
    out+='<span class="'+c+'">'+esc(m[0])+'</span>';
    last=re.lastIndex;
  }
  return out+esc(src.slice(last));
}
/* Render code into a <pre class="code">, one span per line; `on` = line indexes to spotlight. */
function code(el,src,on){
  el.innerHTML=hl(src).split("\n").map(function(l,i){return '<span class="ln'+(on&&on.indexOf(i)>-1?" on":"")+'" data-l="'+i+'">'+(l||" ")+'</span>'}).join("");
}
function flash(el,idx){idx.forEach(function(i){var l=el.querySelector('[data-l="'+i+'"]');if(l){l.classList.remove("flash");void l.offsetWidth;l.classList.add("flash")}})}
/* Feedback box: kind is "pass" | "err" | "warn" | "note" | "" (clears). */
function fb(el,kind,html){el.className="fb "+(kind||"");el.innerHTML=html||""}
function fmt(v){if(typeof v==="string")return v;if(v===undefined)return "undefined";try{return JSON.stringify(v)}catch(e){return String(v)}}
/* Console lines: strings, or {c:"in"|"ok"|"bad"|"dim", t:text}. */
function conLines(el,lines){el.innerHTML=lines.map(function(l){return typeof l==="string"?esc(l):'<span class="'+l.c+'">'+esc(l.t)+'</span>'}).join("\n")}

/* Per-viewer storage. store = this lecture; courseStore = shared by every lecture. */
function mk(prefix){return {
  get:function(k){try{return localStorage.getItem(prefix+k)}catch(e){return null}},
  set:function(k,v){try{localStorage.setItem(prefix+k,v)}catch(e){}}
}}
var store=mk(COURSE+":"+LECTURE+":"),courseStore=mk(COURSE+":");

/* ============ chrome ============ */
var stageEl=$("#stage"),deck=$("#deck"),slides=$$(".slide",deck);
stageEl.setAttribute("aria-live","polite");
var hasEx=slides.some(function(s){return s.dataset.ex});
var bar=document.createElement("nav");
bar.id="bar";bar.setAttribute("aria-label","Slide controls");
bar.innerHTML='<div id="rail" style="width:0"></div>'+
  '<a class="cb" href="'+esc(HOME)+'">All lectures</a>'+
  '<button class="cb" data-nav="prev" aria-label="Previous slide">Back</button>'+
  '<button class="cb" data-nav="next" aria-label="Next slide">Next</button>'+
  '<div id="where"><span id="where-n">1/1</span><span id="where-sec"></span></div>'+
  (hasEx?'<button class="cb" data-nav="ex">Next exercise<kbd>E</kbd></button>':'')+
  '<button class="cb" data-nav="index">Index<kbd>I</kbd></button>'+
  '<button class="cb" data-nav="notes">Notes<kbd>N</kbd></button>'+
  '<button class="cb" data-nav="fs" id="fs-btn">Full screen<kbd>F</kbd></button>';
document.body.appendChild(bar);
var sheet=document.createElement("div");
sheet.className="sheet";sheet.id="index";sheet.hidden=true;sheet.setAttribute("role","dialog");sheet.setAttribute("aria-label","Slide index");
sheet.innerHTML='<h2>All slides</h2><div id="idxlist"></div>';
document.body.appendChild(sheet);
var notes=document.createElement("div");
notes.className="sheet";notes.id="notes";notes.hidden=true;notes.setAttribute("role","dialog");notes.setAttribute("aria-label","Speaker notes");
notes.innerHTML='<h2>Notes</h2><div id="notetext"></div>';
document.body.appendChild(notes);
var idxList=$("#idxlist"),noteText=$("#notetext");

/* Add a button to the bar (before Index) with an optional keyboard shortcut. */
var keys={},escapes=[];
function addButton(o){
  var b=document.createElement("button");
  b.className="cb";b.textContent=o.label;
  if(o.key){var k=document.createElement("kbd");k.textContent=o.key.toUpperCase();b.appendChild(k);keys[o.key.toLowerCase()]=o.onClick}
  b.addEventListener("click",o.onClick);
  bar.insertBefore(b,bar.querySelector('[data-nav="index"]'));
  return b;
}

/* ============ navigation ============ */
var cur=0,booted=false;
slides.forEach(function(s,i){
  var b=document.createElement("button");
  var t=s.querySelector(".h1,.hero");
  b.innerHTML='<b>'+String(i+1).padStart(2,"0")+'</b><span>'+esc(t?t.textContent:s.id)+'</span>'+(s.dataset.ex?'<span class="t">Your turn</span>':"");
  b.addEventListener("click",function(){go(i);sheet.hidden=true});
  idxList.appendChild(b);
  if(i>0)s.hidden=true;
});
function go(n){
  n=Math.max(0,Math.min(slides.length-1,n));
  if(booted&&n===cur)return;
  slides[cur].hidden=true;slides[cur].classList.remove("rise");
  cur=n;var s=slides[cur];s.hidden=false;void s.offsetWidth;s.classList.add("rise");booted=true;
  $("#rail").style.width=((cur+1)/slides.length*100)+"%";
  $("#where-n").textContent=(cur+1)+"/"+slides.length;
  $("#where-sec").textContent=s.dataset.sec||"";
  var nt=s.querySelector(".nt");noteText.innerHTML=nt?"<p>"+nt.innerHTML+"</p>":"<p>No notes on this slide.</p>";
  $$("#idxlist button").forEach(function(b,i){b.classList.toggle("cur",i===cur)});
  try{if(location.hash.slice(1)!==s.id)history.replaceState(null,"","#"+s.id)}catch(e){}
}
function nextEx(){for(var i=1;i<=slides.length;i++){var j=(cur+i)%slides.length;if(slides[j].dataset.ex){go(j);return}}}
function scale(){
  var w=stageEl.clientWidth-24,h=stageEl.clientHeight-24;
  var k=Math.max(.1,Math.min(w/1280,h/720));
  deck.style.transform="translate(-50%,-50%) scale("+k+")";
}
window.addEventListener("resize",scale);
if(window.ResizeObserver)new ResizeObserver(scale).observe(stageEl);
function setBarH(){document.documentElement.style.setProperty("--barh",bar.offsetHeight+"px")}
window.addEventListener("resize",setBarH);

var fsOK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
if(!fsOK)$("#fs-btn").hidden=true;
function toggleFS(){
  if(!fsOK)return;
  try{
    if(document.fullscreenElement||document.webkitFullscreenElement){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}
    else{var r=document.documentElement;(r.requestFullscreen||r.webkitRequestFullscreen).call(r)}
  }catch(e){}
}

document.addEventListener("keydown",function(e){
  var tg=e.target.tagName;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(tg))return;
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  var k=e.key,lk=k.length===1?k.toLowerCase():k;
  if(k==="ArrowRight"||k==="PageDown"||(k===" "&&tg!=="BUTTON")){e.preventDefault();go(cur+1)}
  else if(k==="ArrowLeft"||k==="PageUp"){e.preventDefault();go(cur-1)}
  else if(k==="Home")go(0);else if(k==="End")go(slides.length-1);
  else if(lk==="i")sheet.hidden=!sheet.hidden;
  else if(lk==="n")notes.hidden=!notes.hidden;
  else if(lk==="e"&&hasEx)nextEx();
  else if(lk==="f")toggleFS();
  else if(keys[lk]){e.preventDefault();keys[lk]()}
  else if(k==="Escape"){sheet.hidden=true;notes.hidden=true;escapes.forEach(function(f){f()})}
});
$$("[data-nav]",bar).forEach(function(b){b.addEventListener("click",function(){
  var a=b.dataset.nav;
  if(a==="prev")go(cur-1);else if(a==="next")go(cur+1);
  else if(a==="index")sheet.hidden=!sheet.hidden;
  else if(a==="notes")notes.hidden=!notes.hidden;
  else if(a==="ex")nextEx();else if(a==="fs")toggleFS();
})});
var tx=null;
stageEl.addEventListener("touchstart",function(e){if(e.target.closest("button,input,textarea,a,label,.part"))return;tx=e.touches[0].clientX},{passive:true});
stageEl.addEventListener("touchend",function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>60)go(cur+(dx<0?1:-1))},{passive:true});

/* ============ boot ============ */
scale();setBarH();
var h=location.hash.slice(1),start=0;
slides.forEach(function(s,i){if(s.id===h)start=i});
go(start);
window.addEventListener("hashchange",function(){var id=location.hash.slice(1);slides.forEach(function(s,i){if(s.id===id)go(i)})});

window.Deck={
  course:COURSE,lecture:LECTURE,
  $:$,$$:$$,esc:esc,hl:hl,code:code,flash:flash,fb:fb,fmt:fmt,conLines:conLines,
  store:store,courseStore:courseStore,
  go:go,scale:scale,addButton:addButton,onEscape:function(f){escapes.push(f)}
};
})();
