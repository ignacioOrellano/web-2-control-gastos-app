import {
  getAllGastos,
  getAllGastosByUserId,
  saveOneGasto,
} from "../models/gasto.js";
import {
  validarGasto,
} from "../helpers/validaciones.js";
import { 
  getOneUsuarioById
} from "../models/usuario.js";

export async function getGastos(req, res, options = {}) {
  try {
    const gastos = await getAllGastos();
    res.render('gastos/index', { gastos: gastos, ...options });
  } catch (error) {
    console.error('Error al leer el archivo de gastos:', error);
    res.status(500).send('Error al cargar los gastos');
  }
}

export async function getGastosByUserId(req, res) {
  const usuarioId = Number(req.params.id)
  try {
    const usuarioEncontrado = await getOneUsuarioById(usuarioId);

    if(!usuarioEncontrado){
      res.status(404).render('gastos/error', { msg: 'Usuario no encontrado' });
      return;
    }

    const gastosFiltrados = await getAllGastosByUserId(usuarioEncontrado.id);

    res.render('gastos/byuser', { 
      gastos: gastosFiltrados,
      user: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre
      }
    });
  } catch (error) {
    console.error('Error al leer el archivo de gastos:', error);
    res.status(500).send('Error al cargar los gastos');
  }
}

export function getNuevoGasto(req, res) {
  res.render('gastos/nuevo');
}

export async function postNuevoGasto(req, res) {
  const body = req.body
  const { titulo, descripcion, categoriaId } = body;
  const monto = Number(body.monto);

  const validacion = validarGasto({
    monto: monto,
    titulo: titulo,
    descripcion: descripcion,
  })

  if(validacion.success === false){
    const montoError = validacion.errors.monto;
    const tituloError = validacion.errors.titulo;
    let msg = '';
    if(montoError){
      for(const e of montoError){
        msg += ' ' + e
      }
    }
    if(tituloError){
      for(const e of tituloError){
        msg += ' ' + e
      }
    }
    res.status(400).render('gastos/error', { msg: msg, alert: { status: 'error', text: "No se pudo crear el gasto!" } })
    return
  }

  const nuevoGasto = {
    monto: monto,
    titulo: titulo,
    descripcion: descripcion ? descripcion : '',
    categoriaId: 1,
    userId: 1,
  }

  await saveOneGasto(nuevoGasto)

  let options = {
    alert: {
      status: 'success',
      text: 'Gasto creado exitosamente!'
    }
  }

  await getGastos(req, res, options);
}