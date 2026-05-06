const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const {
  register,
  login,
  logout
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Iniciar login con GitHub
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
);

// Callback de GitHub
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api/v1/auth/github/failure'
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        userId: req.user._id,
        role: req.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login con GitHub exitoso',
      token,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);

router.get('/github/failure', (req, res) => {
  res.status(401).json({
    message: 'Error al autenticar con GitHub'
  });
});

module.exports = router;