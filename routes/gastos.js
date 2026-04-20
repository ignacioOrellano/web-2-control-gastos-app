import { Router } from "express"
import path from 'path';
import fs from 'fs/promises';

// /gastos
const router = Router()

// /gastos/ 
router.get('/', async (req, res) => {
  try {
    const gastosJSON = await fs.readFile(path.join(process.cwd(), 'db', 'gastos.json'), 'utf-8');
    const gastos = JSON.parse(gastosJSON);
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
      res.status(404).render('gastos/error');
      return;
    }

    const gastosJSON = await fs.readFile(path.join(process.cwd(), 'db', 'gastos.json'), 'utf-8');
    const gastos = JSON.parse(gastosJSON);

    const gastosFiltrados = gastos.filter(g => g.userId === usuarioEncontrado.id);

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
// /gastos/editar/:id


export default router;