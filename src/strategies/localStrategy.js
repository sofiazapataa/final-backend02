const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }

        if (!user.password) {
          return done(null, false, { message: 'Usuario registrado con OAuth' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);