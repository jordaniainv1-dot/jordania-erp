import { watchAuth } from "./auth.js";
import { listEmployees, createEmployee, updateEmployee, archiveEmployee, normalizeCedula } from "./employees-service.js";
import { DEPARTAMENTOS, ESTADOS, TIPOS_CONTRATO, SUCURSAL } from "./catalogs.js";

const state = { items: [], editing: null, oldCedula: "" };
const $ = (s) => document.querySelector(s);
const form = $("#employeeForm"), tbody = $("#employeesTableBody"), modal = $("#employeeModal");

watchAuth(user => user ? init() : window.location.replace("../index.html"));

async function init() {
  fill("#departamento", DEPARTAMENTOS, "Selecciona un departamento");
  fill("#departmentFilter", DEPARTAMENTOS, "Todos los departamentos");
  fill("#estado", ESTADOS);
  fill("#statusFilter", ESTADOS, "Todos los estados");
  fill("#tipoContrato", TIPOS_CONTRATO, "Selecciona un tipo");
  $("#sucursal").value = SUCURSAL;
  bind();
  await load();
}

function fill(selector, values, placeholder="") {
  const el = $(selector); el.innerHTML = placeholder ? `<option value="">${placeholder}</option>` : "";
  values.forEach(v => el.insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`));
}

function bind() {
  $("#addEmployeeButton").onclick = openCreate;
  $("#employeeModalClose").onclick = close;
  $("#employeeModalCancel").onclick = close;
  form.onsubmit = save;
  ["#employeeSearch","#departmentFilter","#statusFilter"].forEach(s => $(s).addEventListener("input", render));
  tbody.onclick = action;
}

async function load() {
  $("#employeesLoading").hidden = false;
  try { state.items = await listEmployees(); render(); }
  catch (e) { console.error(e); toast("No se pudieron cargar los colaboradores", true); }
  finally { $("#employeesLoading").hidden = true; }
}

function filtered() {
  const q = $("#employeeSearch").value.trim().toLowerCase();
  const dep = $("#departmentFilter").value, status = $("#statusFilter").value;
  return state.items.filter(e => {
    const text = [e.primerNombre,e.segundoNombre,e.primerApellido,e.segundoApellido,e.cedula,e.cargo].filter(Boolean).join(" ").toLowerCase();
    return !e.archivado && (!q || text.includes(q)) && (!dep || e.departamento===dep) && (!status || e.estado===status);
  });
}

function render() {
  const items = filtered();
  $("#employeesCount").textContent = `${items.length} colaborador${items.length===1?"":"es"}`;
  tbody.innerHTML = items.map(e => `<tr>
    <td><div class="employee-cell"><div class="employee-avatar">${initials(e)}</div><div><strong>${esc(fullName(e))}</strong><span>${esc(e.cargo||"Sin cargo")}</span></div></div></td>
    <td>${esc(e.cedula)}</td><td>${esc(e.departamento)}</td><td>${date(e.fechaIngreso)}</td>
    <td><span class="status-pill status-${slug(e.estado)}">${esc(e.estado)}</span></td>
    <td><button class="icon-button" data-edit="${e.id}">✎</button><button class="icon-button danger" data-archive="${e.id}">⌫</button></td>
  </tr>`).join("");
  $("#employeesTable").hidden = !items.length;
  $("#employeesEmpty").hidden = !!items.length;
}

function action(ev) {
  const b = ev.target.closest("button"); if (!b) return;
  const id = b.dataset.edit || b.dataset.archive;
  const employee = state.items.find(x => x.id===id); if (!employee) return;
  if (b.dataset.edit) openEdit(employee);
  if (b.dataset.archive && confirm(`¿Archivar a ${fullName(employee)}?`)) archiveEmployee(id).then(load).then(()=>toast("Colaborador archivado"));
}

function openCreate() {
  state.editing=null; state.oldCedula=""; form.reset(); $("#sucursal").value=SUCURSAL; $("#estado").value="Activo";
  $("#employeeModalTitle").textContent="Registrar colaborador"; showModal();
}

function openEdit(e) {
  state.editing=e.id; state.oldCedula=e.cedula; $("#employeeModalTitle").textContent="Editar colaborador";
  Object.entries(e).forEach(([k,v]) => { const f=form.elements.namedItem(k); if(f && typeof v!=="object") f.value=v??""; });
  showModal();
}

async function save(ev) {
  ev.preventDefault(); const d = Object.fromEntries(new FormData(form));
  Object.keys(d).forEach(k => d[k]=String(d[k]||"").trim()); d.cedula=normalizeCedula(d.cedula); d.sucursal=SUCURSAL;
  const msg = !d.primerNombre?"Escribe el primer nombre":!d.primerApellido?"Escribe el primer apellido":!d.cedula?"Escribe la cédula":!d.fechaIngreso?"Selecciona la fecha de ingreso":!d.departamento?"Selecciona el departamento":!d.cargo?"Escribe el cargo":!d.tipoContrato?"Selecciona el tipo de contrato":"";
  if(msg) return formMessage(msg);
  $("#saveEmployeeButton").disabled=true;
  try {
    state.editing ? await updateEmployee(state.editing,d,state.oldCedula) : await createEmployee(d);
    close(); await load(); toast(state.editing?"Colaborador actualizado":"Colaborador registrado");
  } catch(e) { formMessage(e.code==="employee/duplicate"?"Ya existe un colaborador con esa cédula":"No fue posible guardar"); }
  finally { $("#saveEmployeeButton").disabled=false; }
}

function showModal(){ modal.hidden=false; requestAnimationFrame(()=>modal.classList.add("is-open")); }
function close(){ modal.classList.remove("is-open"); setTimeout(()=>modal.hidden=true,180); formMessage(""); }
function formMessage(m){ $("#employeeFormMessage").textContent=m; $("#employeeFormMessage").className=m?"form-message error":"form-message"; }
function toast(m,error=false){ const t=$("#toast"); t.textContent=m; t.className=`toast is-visible ${error?"error":""}`; setTimeout(()=>t.classList.remove("is-visible"),2800); }
function fullName(e){ return [e.primerNombre,e.segundoNombre,e.primerApellido,e.segundoApellido].filter(Boolean).join(" "); }
function initials(e){ return `${e.primerNombre?.[0]||""}${e.primerApellido?.[0]||""}`.toUpperCase(); }
function date(v){ return v?new Intl.DateTimeFormat("es-PA",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(v+"T12:00:00")):"—"; }
function slug(v){ return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g,"-"); }
function esc(v){ return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
