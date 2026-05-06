const express = require('express');
const router = express.Router();

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

module.exports = router;