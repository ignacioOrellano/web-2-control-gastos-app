import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import expenseRouter from './routes/expense.js';
import authRouter from './routes/auth.js';
import tagRouter from './routes/tag.js';
import { authMiddleware } from './middleware/auth.js';
import { User } from './models/User.js';
import { connectDatabase } from './models/index.js';

// CONSTANTES
const PORT = process.env.PORT;

const app = express();

// MIDDLEWARES
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // produccion cambiar a true
    maxAge: 24 * 60 * 60 * 1000, // 24h
    httpOnly: true,
    sameSite: 'lax', 
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next)=>{
  res.locals.currentPath = req.path;
  next()
})

// MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

// RUTAS
app.get('/', (req, res) => {
  res.render('index');
})

app.use('/auth', authRouter);

app.use('/expense', authMiddleware, expenseRouter);
app.use('/tag', authMiddleware, tagRouter);


// CONEXION A BD
connectDatabase()
  .then(() => {
    app.listen(PORT, (err) => {
      if(err) {
        console.error('[+] Error al iniciar el servidor:', err);
        return;
      }
      console.log(`[+] Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[+] Error sincronizando con bd:', err)
  })
