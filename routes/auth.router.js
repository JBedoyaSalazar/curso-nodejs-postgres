import express from 'express';
import passport from 'passport';
import AuthService from '../services/auth.service.js';
import validatorHandler from './../middlewares/validator.handler.js';
import { changePasswordSchema } from './../schemas/user.schema.js';

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
    const response = await service.sendRecoveryPassword(email);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/change-password',
  validatorHandler(changePasswordSchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const response = await service.changePassword(token, newPassword);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
