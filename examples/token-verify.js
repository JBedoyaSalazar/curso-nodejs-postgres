import jwt from 'jsonwebtoken';

const secret = 'MY_SECRET_KEY';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc4Mjk0NDU0MywiZXhwIjoxNzgzMDMwOTQzfQ.bOkJbv0xavH0r0-Sj9muCoRsBmbN3zC1KQ4OqQTe-m4'

/**
 * Demonstrates how to verify a JWT and read its payload.
 *
 * @param {string} token - JWT to verify.
 * @param {string} secret - Secret used to verify the token.
 * @returns {string|object} Verified JWT payload.
 */
function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log('Verified Payload:', payload);
