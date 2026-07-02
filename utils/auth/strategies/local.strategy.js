import { Strategy } from 'passport-local';
import AuthService  from '../../../services/auth.service.js';
const service = new AuthService();

/**
 * Passport local strategy that authenticates with the `email` request field and password.
 */
export const localStrategy = new Strategy({
    usernameField: 'email'
  },
  async (email, password, done) => {
    try {
      const user = await service.getUser(email, password);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);
