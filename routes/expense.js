import { Router } from "express"
import { 
  getExpenses,
  getNewExpense,
  postNewExpense,
  getEditExpense,
  postEditExpense,
  postDeleteExpense,
} from '../controller/expense.js'

// /expense
const router = Router()

// /expense/ 
router.get('/', getExpenses)

// /expense/nuevo
router.get('/nuevo', getNewExpense);
router.post('/nuevo', postNewExpense);

// /expense/editar/:id
router.get('/editar/:id', getEditExpense);
router.post('/editar/:id', postEditExpense);

// /expense/eliminar/:id
router.post('/eliminar/:id', postDeleteExpense);


export default router;