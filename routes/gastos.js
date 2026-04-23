import { Router } from "express"
import path from 'path';
import fs from 'fs/promises';
import { 
  validarGasto,
  saveOneGasto,
  getAllGastos,
  getAllGastosByUserId,
  getNextGastoId
} from '../models/gasto.js'

// /gastos
const router = Router()

// /gastos/ 
router.get('/', async (req, res) => {
  try {
    const gastos = await getAllGastos();
    res.render('gastos/index', { gastos: gastos });
  } catch (error) {
    console.error('Error al leer el archivo de gastos:', error);
    res.status(500).send('Error al cargar los gastos');
  }
})

// /gastos/user/:id
router.get('/user/:id', async (req, res) => {
  const usuarioId = Number(req.params.id)
  try {
    const usuariosJSON = await fs.readFile(path.join(process.cwd(), 'db', 'usuarios.json'), 'utf-8');
    const usuarios = JSON.parse(usuariosJSON);
    const usuarioEncontrado = usuarios.find(u => u.id === usuarioId);

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
})

// /gastos/:id

// /gastos/nuevo
router.get('/nuevo', (req, res)=> {
  res.render('gastos/nuevo')
});

router.post('/nuevo', async (req, res) => {
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
    res.status(400).render('gastos/error', { msg: msg })
    return
  }

  const nuevoGasto = {
    id: await getNextGastoId(),
    monto: monto,
    titulo: titulo,
    descripcion: descripcion ? descripcion : '',
    categoriaId: 1,
    userId: 1,
  }

  await saveOneGasto(nuevoGasto)

  res.redirect('/gastos/')
})

// /gastos/editar/:id


export default router;