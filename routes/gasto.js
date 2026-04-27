import { Router } from "express"
import { 
  getGastos,
  getGastosByUserId,
  getNuevoGasto,
  postNuevoGasto
} from '../controller/gasto.js'

// /gastos
const router = Router()

// /gastos/ 
router.get('/', getGastos)

// /gastos/user/:id
router.get('/user/:id', getGastosByUserId)

// /gastos/:id

// /gastos/nuevo
router.get('/nuevo', getNuevoGasto);

router.post('/nuevo', postNuevoGasto);

// /gastos/editar/:id


export default router;