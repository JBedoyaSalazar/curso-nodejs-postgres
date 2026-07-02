import { Strategy, ExtractJwt } from 'passport-jwt';
import { config } from '../../../config/config.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
}

/**
 * Passport JWT strategy that exposes the verified token payload as `req.user`.
 */
export const JwtStrategy = new Strategy(options, (payload, done) => {
  try {
    return done(null, payload);
  } catch (error) {
    done(error, false);
  }
});
