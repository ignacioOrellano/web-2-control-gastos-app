import { Router } from "express"
import { 
  getGastos,
  getGastosByUserId,
  getNuevoUser,
  postNuevoUser
} from '../controller/gasto.js'

// /gastos
const router = Router()

// /gastos/ 
router.get('/', getGastos)

// /gastos/user/:id
router.get('/user/:id', getGastosByUserId)

// /gastos/:id

// /gastos/nuevo
router.get('/nuevo', getNuevoUser);

router.post('/nuevo', postNuevoUser);

// /gastos/editar/:id


export default router;