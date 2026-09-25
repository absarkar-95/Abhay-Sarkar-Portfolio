const projects=[
{name:"SPJ",type:"BRAND FILM",desc:"AI driven brand film / motion design",tags:"AI / MOTION / EDIT"},
{name:"MVN",type:"REAL ESTATE / MOTION",desc:"Visual campaign and motion graphics",tags:"MOTION / EDIT / DESIGN"},
{name:"MINK",type:"BRAND CONTENT",desc:"Social-first visual storytelling",tags:"CONTENT / MOTION / EDIT"},
{name:"EMPERIUM",type:"BRAND FILM",desc:"Cinematic visual development",tags:"AI / ART DIRECTION / FILM"},
{name:"CAPTAIN PURE",type:"PRODUCT / MOTION",desc:"Product-focused visual communication",tags:"PRODUCT / MOTION / EDIT"}
];

const viewport=document.getElementById("timelineViewport");
const content=document.getElementById("timelineContent");
const track=document.getElementById("projectTrack");
const ruler=document.getElementById("timeRuler");
const title=document.getElementById("projectTitle");
const desc=document.getElementById("projectDescription");
const tags=document.getElementById("projectTags");
const type=document.getElementById("stageType");
const counter=document.getElementById("counter");
const indexLabel=document.getElementById("projectIndex");
const status=document.getElementById("statusText");
const timecode=document.getElementById("timecode");
const position=document.getElementById("position");

const leftPad=Math.max(0,Math.round(viewport.clientWidth/2-155));
const rightPad=leftPad;
track.style.paddingLeft=leftPad+"px";
track.style.paddingRight=rightPad+"px";

for(let i=0;i<=12;i++){
  const label=document.createElement("span");
  label.className="ruler-label";
  label.style.left=(i*400+8)+"px";
  const seconds=i*10;
  label.textContent=`00:${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  ruler.appendChild(label);
}

projects.forEach((p,i)=>{
  const button=document.createElement("button");
  button.type="button";
  button.className="project";
  button.dataset.index=i;
  button.innerHTML=`<span class="thumb" aria-hidden="true"></span><span class="project-info"><span class="project-name">${p.name}</span><span class="project-type">${p.type}</span></span>`;
  button.addEventListener("click",()=>centerProject(i));
  track.appendChild(button);
});

const cards=[...document.querySelectorAll(".project")];

function centerProject(i){
  const card=cards[i];
  const vp=viewport.getBoundingClientRect();
  const rect=card.getBoundingClientRect();
  const delta=(rect.left+rect.width/2)-(vp.left+vp.width/2);
  viewport.scrollBy({left:delta,behavior:"smooth"});
}

function activate(i){
  cards.forEach((card,n)=>card.classList.toggle("active",n===i));
  const p=projects[i];
  title.textContent=p.name;
  desc.textContent=p.desc;
  tags.textContent=p.tags;
  type.textContent=p.type;
  counter.textContent=String(i+1).padStart(2,"0");
  indexLabel.textContent=String(i+1).padStart(2,"0");
  status.textContent="PLAYHEAD / "+String(i+1).padStart(2,"0");
}

function updateTimeline(){
  const centerX=viewport.getBoundingClientRect().left+viewport.clientWidth/2;
  let nearest=0;
  let nearestDistance=Infinity;

  cards.forEach((card,i)=>{
    const rect=card.getBoundingClientRect();
    const d=Math.abs((rect.left+rect.width/2)-centerX);
    if(d<nearestDistance){nearestDistance=d;nearest=i;}
  });

  activate(nearest);

  const max=Math.max(1,viewport.scrollWidth-viewport.clientWidth);
  const progress=Math.max(0,Math.min(1,viewport.scrollLeft/max));
  position.textContent=String(Math.round(progress*100)).padStart(2,"0")+"%";

  const totalSeconds=Math.round(progress*120);
  const minutes=Math.floor(totalSeconds/60);
  const seconds=totalSeconds%60;
  const frames=Math.round((progress*120%1)*24);
  timecode.textContent=`00:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}:${String(frames).padStart(2,"0")}`;
}

viewport.addEventListener("scroll",updateTimeline,{passive:true});
viewport.addEventListener("wheel",(e)=>{
  if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
    e.preventDefault();
    viewport.scrollLeft+=e.deltaY;
  }
},{passive:false});

viewport.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowRight"){e.preventDefault();viewport.scrollBy({left:260,behavior:"smooth"});}
  if(e.key==="ArrowLeft"){e.preventDefault();viewport.scrollBy({left:-260,behavior:"smooth"});}
  if(e.key==="Home"){e.preventDefault();viewport.scrollTo({left:0,behavior:"smooth"});}
  if(e.key==="End"){e.preventDefault();viewport.scrollTo({left:viewport.scrollWidth,behavior:"smooth"});}
});

const panel=document.getElementById("infoPanel");
document.getElementById("menuButton").addEventListener("click",()=>{panel.classList.add("open");panel.setAttribute("aria-hidden","false")});
document.getElementById("closeInfo").addEventListener("click",()=>{panel.classList.remove("open");panel.setAttribute("aria-hidden","true")});

document.getElementById("year").textContent=new Date().getFullYear();

requestAnimationFrame(()=>{
  // Center the first project beneath the fixed playhead.
  const card=cards[0];
  const target=card.offsetLeft+(card.offsetWidth/2)-(viewport.clientWidth/2);
  viewport.scrollLeft=Math.max(0,target);
  updateTimeline();
});