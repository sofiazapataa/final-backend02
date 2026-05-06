const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

module.exports = app;