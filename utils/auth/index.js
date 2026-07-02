import passport from 'passport';
import { localStrategy } from './strategies/local.strategy.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

passport.use(JwtStrategy);
passport.use(localStrategy);
