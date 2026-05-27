import { Router } from "express"
import { login, loginForm, signup, signupForm } from "../controller/auth.js"

const auth = Router()
auth.get('/login', loginForm)

auth.post('/login', login)

auth.get('/signup', signupForm)

auth.post('/signup', signup)

export default auth