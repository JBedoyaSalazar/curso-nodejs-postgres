import boom from '@hapi/boom';
import { config } from '../config/config.js';

/**
 * Protects a route with the static API key configured in environment variables.
 *
 * @param {import('express').Request} req - Express request containing the `api` header.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 */
export function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];

  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

/**
 * Allows access only to authenticated users with the `admin` role.
 *
 * @param {import('express').Request & { user?: { role?: string } }} req - Express request populated by Passport.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {void}
 */
export function checkAdminRole(req, res, next) {
  const user = req.user;
  if(user.role === 'admin') {
    next();
  } else {
    next(boom.forbidden());
  }
}

/**
 * Creates an authorization middleware for one or more accepted roles.
 *
 * @param {...string} roles - Roles allowed to access the route.
 * @returns {import('express').RequestHandler} Middleware that checks `req.user.role`.
 *
 * @example
 * router.post('/', passport.authenticate('jwt', { session: false }), checkRoles('admin'), handler);
 */
export function checkRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.forbidden());
    }
  };
}

