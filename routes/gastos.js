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
router.get('/nuevo', (req, res)=> {
  res.render('gastos/nuevo')
});

router.post('/nuevo', async (req, res) => {
  const body = req.body
  const { titulo, descripcion, categoriaId } = body;
  const monto = Number(body.monto);


  let flagError = false;
  let msgError = '';
  
  if(!monto || !titulo){
    msgError = "No completo bien el formulario"
    flagError = true
  }

  if(isNaN(monto)){
    msgError += "El monto debe ser un numero"
    flagError = true
  }
  if(monto < 0){
    msgError += "El monto debe ser mayor a cero"
    flagError = true
  }
  if(titulo.length === 0){
    msgError += "Debe completar titulo"
    flagError = true
  }

  if(flagError){
    res.status(400).render('gastos/error', { msg: msgError })
    return
  }

  const gastosJSON = await fs.readFile(path.join(process.cwd(), 'db', 'gastos.json'), 'utf-8');
  const gastos = JSON.parse(gastosJSON);

  const nuevoGasto = {
    id: gastos.length + 1,
    monto: monto,
    titulo: titulo,
    descripcion: descripcion ? descripcion : '',
    categoriaId: 1,
    userId: 1,
  }

  // guardar en bd
  gastos.push(nuevoGasto)
  await fs.writeFile(path.join(process.cwd(), 'db', 'gastos.json'), JSON.stringify(gastos, null, 2), 'utf-8')

  res.redirect('/gastos/')
})

// /gastos/editar/:id


export default router;