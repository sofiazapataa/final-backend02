const express = require('express');
const router = express.Router();

const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Perfil del usuario',
    user: req.user
  });
});

router.get('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.status(200).json({
    message: 'Ruta solo para administradores',
    user: req.user
  });
});

router.get('/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      message: 'Usuarios obtenidos correctamente',
      users
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

router.get('/session', (req, res) => {
  res.status(200).json({
    message: 'Sesión actual',
    session: req.session
  });
});

module.exports = router;