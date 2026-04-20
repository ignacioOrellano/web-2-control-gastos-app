import { Router } from "express"
import path from 'path';
import fs from 'fs/promises';

const router = Router()

// /gastos/ 
router.get('/', async (req, res) => {
  try {
    const gastosJSON = await fs.readFile(path.join(process.cwd(), 'db', 'gastos.json'), 'utf-8');
    const gastos = JSON.parse(gastosJSON);
    res.render('gastos', { gastos: gastos });
  } catch (error) {
    console.error('Error al leer el archivo de gastos:', error);
    res.status(500).send('Error al cargar los gastos');
  }
})

// /gastos/:id
// /gastos/nuevo
// /gastos/editar/:id


export default router;