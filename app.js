const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

require('./src/strategies/githubStrategy');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000
    }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

module.exports = app;