import fs from 'fs/promises';
import path from 'path';

// METODOS PRIVADOS - de acceso a datos, etc. No exportados, solo usados dentro de este módulo
async function getGastos() {
  const gastosJSON = await fs.readFile(path.join(process.cwd(), 'db/gastos.json'), 'utf-8');
  const gastos = JSON.parse(gastosJSON);
  return gastos
}

async function saveGastos(gastos) {
  await fs.writeFile(path.join(process.cwd(), 'db/gastos.json'), JSON.stringify(gastos, null, 2), 'utf-8');
}

async function getNextGastoId() {
  const gastos = await getGastos();
  const maxId = gastos.length;
  return maxId + 1;
}

// FUNCIONES DE NEGOCIO - exportadas para ser usadas en rutas, controladores, etc
export async function saveOneGasto(gasto){
  const siguienteId = await getNextGastoId();
  gasto.id = siguienteId;
  const gastos = await getGastos();
  gastos.push(gasto)
  await saveGastos(gastos);
}

export async function getAllGastos() {
  const gastos = await getGastos();
  return gastos
}

export async function getOneGastoById(id) {
  const gastos = await getGastos();
  const gastoEncontrado = gastos.find(g => g.id === id)
  return gastoEncontrado
}

export async function getAllGastosByUserId(userId){
  const gastos = await getGastos();
  const gastosEncontrados = gastos.filter(g => g.userId === userId)
  return gastosEncontrados
}
