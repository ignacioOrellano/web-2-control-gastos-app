import fs from 'fs/promises';
import path from 'path';

// METODOS PRIVADOS - de acceso a datos, etc. No exportados, solo usados dentro de este módulo
async function getUsuarios() {
  const usuariosJSON = await fs.readFile(path.join(process.cwd(), 'db/usuarios.json'), 'utf-8');
  const usuarios = JSON.parse(usuariosJSON);
  return usuarios
}

async function saveUsuarios(usuarios) {
  await fs.writeFile(path.join(process.cwd(), 'db/usuarios.json'), JSON.stringify(usuarios, null, 2), 'utf-8');
}

// FUNCIONES DEL MODELO
export async function getAllUsuarios() {
  const usuarios = await getUsuarios();
  return usuarios
}

export async function getOneUsuarioById(id) {
  const usuarios = await getUsuarios();
  const usuarioEncontrado = usuarios.find(u => u.id === id)
  return usuarioEncontrado
}