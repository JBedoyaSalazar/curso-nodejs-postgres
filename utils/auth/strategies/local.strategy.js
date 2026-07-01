import { Strategy } from 'passport-local';
import userService  from '../../../services/user.service.js';
import boom from '@hapi/boom';
import bycrypt from 'bcrypt';
const service = new userService();

export const localStrategy = new Strategy({
    usernameField: 'email'
  },
  async (email, password, done) => {
    try {
      const user = await service.findByEmail(email);
      if (!user) {
        return done(boom.unauthorized('Email o contraseña incorrecta'), false);
      }

      const isMatch = await bycrypt.compare(password, user.password);
      if (!isMatch) {
        return done(boom.unauthorized('Email o contraseña incorrecta'), false);
      }

      delete user.dataValues.password;
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);
