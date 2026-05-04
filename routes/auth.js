import { Router } from "express"

const auth = Router()
auth.get('/login', (req, res) => {
  res.render('auth/login')
})

auth.post('/login', (req, res) => {
  // TODO: Aquí iría la lógica de autenticación

  // si esta todo ok => luego de redirecciona al home
  res.redirect('/gastos')
})

auth.get('/signup', (req, res) => {
  res.render('auth/signup')
})

auth.post('/signup', (req, res) => {
  // TODO: Aquí iría la lógica de registro de usuario
  
  // si esta todo ok => luego de redirecciona al home
  res.redirect('/gastos')
})

export default auth