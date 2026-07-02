import jwt from 'jsonwebtoken';

const secret = 'MY_SECRET_KEY';

const payload = {
  sub: 1,
  role: 'customer'
};

/**
 * Demonstrates how to sign a JWT from a payload and secret.
 *
 * @param {object} payload - Claims to include in the token.
 * @param {string} secret - Secret used to sign the token.
 * @returns {string} Signed JWT.
 */
function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret);
console.log('Generated Token:', token);
