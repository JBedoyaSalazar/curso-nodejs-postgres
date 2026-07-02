import express from 'express';
import passport from 'passport';
import orderService from '../services/order.service.js';

const router = express.Router();
const service = new orderService();

router.get(
  '/my-orders',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      console.log(req.user);
      const user = req.user;
      const orders = await service.findByUser(user.sub);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
