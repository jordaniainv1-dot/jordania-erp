import {
  collection, addDoc, updateDoc, doc, getDocs, query,
  orderBy, serverTimestamp, where, limit
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "../config/firebase.js";

const ref = collection(db, "empleados");
export const normalizeCedula = (v) => String(v || "").trim().replace(/\s+/g, "").toUpperCase();
const searchName = (d) => [d.primerNombre,d.segundoNombre,d.primerApellido,d.segundoApellido].filter(Boolean).join(" ").toLowerCase();

export async function listEmployees() {
  const snap = await getDocs(query(ref, orderBy("nombreBusqueda", "asc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function findByCedula(cedula) {
  const snap = await getDocs(query(ref, where("cedula", "==", normalizeCedula(cedula)), limit(1)));
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function createEmployee(data) {
  if (await findByCedula(data.cedula)) throw Object.assign(new Error("Cédula duplicada"), { code: "employee/duplicate" });
  return addDoc(ref, { ...data, nombreBusqueda: searchName(data), archivado: false, creadoEn: serverTimestamp(), actualizadoEn: serverTimestamp() });
}

export async function updateEmployee(id, data, oldCedula) {
  if (data.cedula !== oldCedula) {
    const found = await findByCedula(data.cedula);
    if (found && found.id !== id) throw Object.assign(new Error("Cédula duplicada"), { code: "employee/duplicate" });
  }
  return updateDoc(doc(db, "empleados", id), { ...data, nombreBusqueda: searchName(data), actualizadoEn: serverTimestamp() });
}

export async function archiveEmployee(id) {
  return updateDoc(doc(db, "empleados", id), { archivado: true, estado: "Retirado", fechaSalida: new Date().toISOString().slice(0,10), actualizadoEn: serverTimestamp() });
}
