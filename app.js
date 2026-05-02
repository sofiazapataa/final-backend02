const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

module.exports = app;