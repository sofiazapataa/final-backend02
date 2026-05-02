const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./src/routes/authRoutes');

app.use('/api/v1/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

module.exports = app;