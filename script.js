const projects=[
  {name:"SPJ",type:"BRAND FILM",desc:"AI driven brand film / motion design",tags:"AI / MOTION / EDIT"},
  {name:"MVN",type:"REAL ESTATE / MOTION",desc:"Visual campaign and motion graphics",tags:"MOTION / EDIT / DESIGN"},
  {name:"MINK",type:"BRAND CONTENT",desc:"Social-first visual storytelling",tags:"CONTENT / MOTION / EDIT"},
  {name:"EMPERIUM",type:"BRAND FILM",desc:"Cinematic visual development",tags:"AI / ART DIRECTION / FILM"},
  {name:"CAPTAIN PURE",type:"PRODUCT / MOTION",desc:"Product-focused visual communication",tags:"PRODUCT / MOTION / EDIT"}
];

const viewport=document.getElementById("timelineViewport");
const track=document.getElementById("projectTrack");
const title=document.getElementById("projectTitle");
const desc=document.getElementById("projectDescription");
const tags=document.getElementById("projectTags");
const type=document.getElementById("stageType");
const counter=document.getElementById("counter");
const indexLabel=document.getElementById("projectIndex");
const status=document.getElementById("statusText");
const timecode=document.getElementById("timecode");
const position=document.getElementById("position");

const spacer = Math.max(0, Math.floor(viewport.clientWidth/2)-150);
track.style.paddingLeft = spacer+"px";
track.style.paddingRight = spacer+"px";

projects.forEach((p,i)=>{
  const button=document.createElement("button");
  button.type="button";
  button.className="project";
  button.dataset.index=i;
  button.innerHTML=`<span class="thumb" aria-hidden="true"></span><span class="project-info"><span class="project-name">${p.name}</span><span class="project-type">${p.type}</span></span>`;
  button.addEventListener("click",()=>goToProject(i));
  track.appendChild(button);
});

const cards=[...document.querySelectorAll(".project")];

function goToProject(i){
  const card=cards[i];
  const viewportRect=viewport.getBoundingClientRect();
  const cardRect=card.getBoundingClientRect();
  const target=viewport.scrollLeft+(cardRect.left-viewportRect.left)+(cardRect.width/2)-(viewport.clientWidth/2);
  viewport.scrollTo({left:Math.max(0,target),behavior:"smooth"});
}

function activate(i){
  cards.forEach((c,n)=>c.classList.toggle("active",n===i));
  const p=projects[i];
  title.textContent=p.name;
  desc.textContent=p.desc;
  tags.textContent=p.tags;
  type.textContent=p.type;
  counter.textContent=String(i+1).padStart(2,"0");
  indexLabel.textContent=String(i+1).padStart(2,"0");
  status.textContent="PLAYHEAD / "+String(i+1).padStart(2,"0");
}

function update(){
  const center=viewport.getBoundingClientRect().left+viewport.clientWidth/2;
  let nearest=0;
  let distance=Infinity;
  cards.forEach((card,i)=>{
    const rect=card.getBoundingClientRect();
    const d=Math.abs(rect.left+rect.width/2-center);
    if(d<distance){distance=d;nearest=i;}
  });
  activate(nearest);

  const max=Math.max(1,viewport.scrollWidth-viewport.clientWidth);
  const progress=Math.max(0,Math.min(1,viewport.scrollLeft/max));
  position.textContent=Math.round(progress*100).toString().padStart(2,"0")+"%";

  const totalFrames=Math.round(progress*5*60*60);
  const hh=Math.floor(totalFrames/(60*60));
  const mm=Math.floor((totalFrames%(60*60))/60);
  const ss=Math.floor(totalFrames%60);
  timecode.textContent=`${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}:00`;
}

viewport.addEventListener("scroll",update,{passive:true});
viewport.addEventListener("wheel",(e)=>{
  if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){
    e.preventDefault();
    viewport.scrollLeft += e.deltaY;
  }
},{passive:false});

viewport.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowRight"){e.preventDefault();viewport.scrollBy({left:280,behavior:"smooth"});}
  if(e.key==="ArrowLeft"){e.preventDefault();viewport.scrollBy({left:-280,behavior:"smooth"});}
  if(e.key==="Home"){e.preventDefault();viewport.scrollTo({left:0,behavior:"smooth"});}
  if(e.key==="End"){e.preventDefault();viewport.scrollTo({left:viewport.scrollWidth,behavior:"smooth"});}
});

const menuButton=document.getElementById("menuButton");
const closeInfo=document.getElementById("closeInfo");
const panel=document.getElementById("infoPanel");
menuButton.addEventListener("click",()=>{panel.classList.add("open");panel.setAttribute("aria-hidden","false")});
closeInfo.addEventListener("click",()=>{panel.classList.remove("open");panel.setAttribute("aria-hidden","true")});

document.getElementById("year").textContent=new Date().getFullYear();

requestAnimationFrame(()=>{
  // Start with the first project centered under the fixed playhead.
  const first=cards[0];
  const target=first.getBoundingClientRect().left-viewport.getBoundingClientRect().left+(first.offsetWidth/2)-(viewport.clientWidth/2);
  viewport.scrollLeft=Math.max(0,target);
  update();
});