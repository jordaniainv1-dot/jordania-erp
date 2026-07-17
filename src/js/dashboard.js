import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "../config/firebase.js";
import { logoutUser, watchAuth } from "./auth.js";

const $ = s => document.querySelector(s);
watchAuth(async user => {
  if (!user) return window.location.replace("../index.html");
  const email = user.email || "Usuario";
  $("#userEmail").textContent = email;
  $("#userInitial").textContent = email[0].toUpperCase();
  await loadDashboard();
});

$("#logoutButton")?.addEventListener("click", async()=>{ await logoutUser(); window.location.replace("../index.html"); });
$("#menuButton")?.addEventListener("click",()=>{$("#sidebar")?.classList.toggle("is-open");$("#sidebarOverlay")?.classList.toggle("is-visible")});
$("#sidebarOverlay")?.addEventListener("click",()=>{$("#sidebar")?.classList.remove("is-open");$("#sidebarOverlay")?.classList.remove("is-visible")});
$("#currentDate").textContent = new Intl.DateTimeFormat("es-PA",{weekday:"long",year:"numeric",month:"long",day:"numeric"}).format(new Date());

async function loadDashboard(){
  try{
    const snap=await getDocs(collection(db,"empleados"));
    const all=snap.docs.map(d=>({id:d.id,...d.data()})).filter(e=>!e.archivado);
    $("#metricEmployees").textContent=all.length;
    $("#metricVacations").textContent=all.filter(e=>e.estado==="Vacaciones").length;
    $("#metricDisabilities").textContent=all.filter(e=>e.estado==="Incapacidad").length;
    const today=new Date(), end=new Date(); end.setDate(today.getDate()+30);
    $("#metricContracts").textContent=all.filter(e=>{if(!e.fechaFinContrato)return false;const d=new Date(e.fechaFinContrato+"T23:59:59");return d>=today&&d<=end}).length;
    const recent=[...all].sort((a,b)=>(b.actualizadoEn?.seconds||0)-(a.actualizadoEn?.seconds||0)).slice(0,5);
    if(recent.length) $("#recentActivity").innerHTML=recent.map(e=>`<div style="padding:14px 4px;border-bottom:1px solid var(--border)"><strong>${esc(name(e))}</strong><div style="color:var(--muted);font-size:12px;margin-top:4px">${esc(e.departamento||"")} · ${esc(e.estado||"Activo")}</div></div>`).join("");
  }catch(e){console.error("Dashboard:",e)}
}
function name(e){return[e.primerNombre,e.segundoNombre,e.primerApellido,e.segundoApellido].filter(Boolean).join(" ")}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
