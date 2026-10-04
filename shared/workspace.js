/* KD402D in-browser workspace: a code editor + console drawer, and the runner
   that executes student code. Load after deck.js:
     <script src="../shared/workspace.js"></script>
   Any element with class "ws-open" opens the drawer. W toggles it.
   The workspace content is saved per browser and shared by every lecture,
   so code written in one session is still there in the next.
   Adds to window.Deck: run(src, fnName), edKeys(textarea, onRun), workspace.{show, append}. */
(function(){
"use strict";
var D=window.Deck,$=D.$,$$=D.$$;
var SVAL=new URL("vendor/sval.min.js",document.currentScript.src).href;

/* ============ runner ============
   Uses the browser's own engine. If the page's security policy blocks that
   (no 'unsafe-eval'), falls back to the Sval interpreter in vendor/. */
var useSval=false;
function isCSP(err){return err instanceof EvalError||/unsafe-eval|Content Security Policy/i.test(String(err&&err.message))}
function loadSval(){
  if(window.Sval||document.querySelector('script[data-sval]'))return;
  var s=document.createElement("script");s.src=SVAL;s.async=false;s.setAttribute("data-sval","");document.head.appendChild(s);
}
try{(new Function("return 1"))()}catch(e){useSval=true;loadSval()}

/* Run src with a captured console. If fnName is given, returns that function as `value`. */
function run(src,fnName){
  var logs=[];
  var lg=function(){logs.push(Array.prototype.map.call(arguments,D.fmt).join(" "))};
  var fake={log:lg,error:lg,warn:lg,info:lg};
  var pick=fnName?"typeof "+fnName+' === "function" ? '+fnName+" : undefined":"";
  if(!useSval){
    try{new Function("console",src)}catch(err){if(isCSP(err)){useSval=true;loadSval()}else return {logs:logs,error:err}}
  }
  if(!useSval){
    try{return {logs:logs,value:new Function("console",src+(pick?"\nreturn "+pick+";":""))(fake)}}
    catch(err){if(isCSP(err)){useSval=true;loadSval()}else return {logs:logs,error:err}}
  }
  if(!window.Sval)return {logs:logs,blocked:true,error:new Error("The code runner is still loading. Try again in a moment.")};
  try{
    var it=new window.Sval({ecmaVer:"latest",sandBox:true});
    it.import({console:fake});
    it.parse(src);
    it.run(src+(pick?"\nexports.__fn = "+pick+";":""));
    return {logs:logs,value:fnName?it.exports.__fn:undefined};
  }catch(err){return {logs:logs,error:err}}
}
/* Editor keys for a code textarea: Tab indents, Ctrl/⌘+Enter runs, Esc leaves. */
function edKeys(ta,onRun){
  ta.addEventListener("keydown",function(e){
    if(e.key==="Tab"&&!e.shiftKey){e.preventDefault();var s=ta.selectionStart,en=ta.selectionEnd;ta.value=ta.value.slice(0,s)+"  "+ta.value.slice(en);ta.selectionStart=ta.selectionEnd=s+2;ta.dispatchEvent(new Event("input"))}
    else if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();onRun()}
    else if(e.key==="Escape"){ta.blur()}
  });
}

/* ============ drawer ============ */
var START="// Type along here, then press Run.\n\n";
var ws=document.createElement("aside");
ws.className="ws";ws.id="ws";ws.hidden=true;ws.setAttribute("aria-label","Workspace");
ws.innerHTML='<div class="bar"><span>workspace.js</span><button class="x" id="ws-close">Close</button></div>'+
  '<textarea class="code-ed" id="ws-ed" spellcheck="false" aria-label="Workspace code editor"></textarea>'+
  '<div class="tools"><button class="btn" id="ws-run">Run</button><button class="btn ghost" id="ws-clear">Start fresh</button><span>Ctrl / ⌘ + Enter runs</span></div>'+
  '<div class="bar y"><span>console</span></div>'+
  '<div class="console" id="ws-con"><span class="dim">Press Run to see what your code logs.</span></div>';
document.body.appendChild(ws);
var ed=$("#ws-ed"),con=$("#ws-con");
ed.value=D.courseStore.get("workspace")||START;
ed.addEventListener("input",function(){D.courseStore.set("workspace",ed.value)});
var btn=D.addButton({label:"Workspace",key:"w",onClick:function(){show(ws.hidden)}});
btn.setAttribute("aria-pressed","false");
function show(on){
  ws.hidden=!on;document.body.classList.toggle("ws-on",on);D.scale();
  btn.setAttribute("aria-pressed",on);
  if(on)setTimeout(function(){ed.focus()},30);
}
function runWs(){
  var r=run(ed.value),lines=[{c:"in",t:"run workspace.js"}].concat(r.logs);
  if(r.error)lines.push({c:"bad",t:r.blocked?r.error.message:(r.error.name||"Error")+": "+r.error.message});
  else if(!r.logs.length)lines.push({c:"dim",t:"(nothing was logged. Did you call your function and log the result?)"});
  D.conLines(con,lines);con.scrollTop=con.scrollHeight;
}
edKeys(ed,runWs);
$("#ws-run").addEventListener("click",runWs);
$("#ws-close").addEventListener("click",function(){show(false)});
var armed=false;
$("#ws-clear").addEventListener("click",function(){
  var b=this;
  if(!armed){armed=true;b.textContent="Sure? Click again";setTimeout(function(){armed=false;b.textContent="Start fresh"},2500);return}
  armed=false;b.textContent="Start fresh";ed.value=START;D.courseStore.set("workspace",START);
  D.conLines(con,[{c:"dim",t:"Press Run to see what your code logs."}]);
});
document.addEventListener("click",function(e){if(e.target.closest(".ws-open"))show(true)});
D.onEscape(function(){show(false)});

/* Append code to the end of the workspace (keeps what's already there) and open it. */
function append(src){
  var cur=ed.value.trim();
  ed.value=(cur&&cur!==START.trim()?ed.value.replace(/\s*$/,"")+"\n\n":"")+src+"\n";
  D.courseStore.set("workspace",ed.value);show(true);
}

D.run=run;D.edKeys=edKeys;D.workspace={show:show,append:append};
})();
