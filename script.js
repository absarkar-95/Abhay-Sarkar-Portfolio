const projects=[
  {name:"SPJ",type:"BRAND FILM",desc:"AI driven brand film / motion design"},
  {name:"MVN",type:"REAL ESTATE / MOTION",desc:"Visual campaign and motion graphics"},
  {name:"MINK",type:"BRAND CONTENT",desc:"Social-first visual storytelling"},
  {name:"EMPERIUM",type:"BRAND FILM",desc:"Cinematic visual development"},
  {name:"CAPTAIN PURE",type:"PRODUCT / MOTION",desc:"Product-focused visual communication"}
];

const viewport=document.getElementById("timelineViewport");
const track=document.getElementById("projectTrack");
const stageTitle=document.getElementById("stageTitle");
const stageDescription=document.getElementById("stageDescription");
const counter=document.getElementById("counter");
const timecode=document.getElementById("timecode");
const statusText=document.getElementById("statusText");
const infoPanel=document.getElementById("infoPanel");
const menuButton=document.querySelector(".menu-button");
const closeInfo=document.getElementById("closeInfo");

projects.forEach((p,i)=>{
  const el=document.createElement("button");
  el.type="button";
  el.className="project";
  el.dataset.index=i;
  el.innerHTML=`<span class="project-thumb" aria-hidden="true"></span><span class="project-info"><span class="project-name">${p.name}</span><span class="project-type">${p.type}</span></span>`;
  el.addEventListener("click",()=>selectProject(i,true));
  track.appendChild(el);
});

const cards=[...document.querySelectorAll(".project")];

function selectProject(index,center){
  cards.forEach((c,i)=>c.classList.toggle("active",i===index));
  const p=projects[index];
  stageTitle.textContent=p.name;
  stageDescription.textContent=p.desc;
  counter.textContent=String(index+1).padStart(2,"0");
  statusText.textContent="PROJECT "+String(index+1).padStart(2,"0");
  if(center){
    cards[index].scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
  }
}

function updateFromScroll(){
  const max=Math.max(1,viewport.scrollWidth-viewport.clientWidth);
  const progress=viewport.scrollLeft/max;
  const index=Math.min(projects.length-1,Math.max(0,Math.round(progress*(projects.length-1))));
  const frames=Math.round(progress*24*60*60);
  const hh=Math.floor(frames/(24*60*60));
  const mm=Math.floor((frames%(24*60*60))/(24*60));
  const ss=Math.floor((frames%(24*60))/24);
  const ff=frames%24;
  timecode.textContent=`${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}:${String(ff).padStart(2,"0")}`;
  if(!cards[index].classList.contains("active")) selectProject(index,false);
}

viewport.addEventListener("scroll",updateFromScroll,{passive:true});
viewport.addEventListener("wheel",(e)=>{
  if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
    e.preventDefault();
    viewport.scrollLeft+=e.deltaY;
  }
},{passive:false});

viewport.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowRight"){e.preventDefault();viewport.scrollBy({left:240,behavior:"smooth"});}
  if(e.key==="ArrowLeft"){e.preventDefault();viewport.scrollBy({left:-240,behavior:"smooth"});}
});

menuButton.addEventListener("click",()=>{
  infoPanel.classList.add("open");
  infoPanel.setAttribute("aria-hidden","false");
});
closeInfo.addEventListener("click",()=>{
  infoPanel.classList.remove("open");
  infoPanel.setAttribute("aria-hidden","true");
});

document.getElementById("year").textContent=new Date().getFullYear();
selectProject(0,false);
