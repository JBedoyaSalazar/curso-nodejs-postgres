import express from 'express';
import passport from 'passport';
import AuthService from '../services/auth.service.js';

const service = new AuthService();
const router = express.Router();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await service.sendMail(email);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
