const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );
};



// =========================
// REGISTER
// =========================

const register = async (req, res) => {
  try {

    const {
      first_name,
      last_name,
      email,
      password
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'El usuario ya existe'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser._id,
        email: newUser.email
      }
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });

  }
};



// =========================
// LOGIN
// =========================

const login = async (req, res) => {

  try {

    const user = req.user;

    req.login(user, { session: true }, async (error) => {

      if (error) {

        return res.status(500).json({
          message: 'Error al iniciar sesión',
          error: error.message
        });

      }

      const token = generateToken(user);

      // COOKIE JWT
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000
      });

      return res.status(200).json({
        message: 'Login exitoso',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });

    });

  } catch (error) {

    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });

  }

};



// =========================
// PROFILE
// =========================

const profile = async (req, res) => {

  try {

    res.status(200).json({
      message: 'Perfil del usuario',
      user: req.user
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });

  }

};



// =========================
// ADMIN
// =========================

const admin = async (req, res) => {

  try {

    res.status(200).json({
      message: 'Bienvenido administrador',
      user: req.user
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });

  }

};



// =========================
// LOGOUT
// =========================

const logout = async (req, res) => {

  req.logout((error) => {

    if (error) {

      return res.status(500).json({
        message: 'Error al cerrar sesión'
      });

    }

    req.session.destroy(() => {

      res.clearCookie('connect.sid');

      res.clearCookie('authToken');

      return res.status(200).json({
        message: 'Logout exitoso'
      });

    });

  });

};



// =========================
// GITHUB SUCCESS
// =========================

const githubSuccess = async (req, res) => {

  try {

    const token = generateToken(req.user);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
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

  } catch (error) {

    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });

  }

};



// =========================
// EXPORTS
// =========================

module.exports = {
  register,
  login,
  profile,
  admin,
  logout,
  githubSuccess
};