import passport from 'passport';
import { localStrategy } from './strategies/local.strategy.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

/**
 * Registers the Passport strategies used by the authentication and protected routes.
 */
passport.use(JwtStrategy);
passport.use(localStrategy);
