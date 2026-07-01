import jwt from 'jsonwebtoken';

const secret = 'MY_SECRET_KEY';

const payload = {
  sub: 1,
  role: 'customer'
};

function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret);
console.log('Generated Token:', token);
