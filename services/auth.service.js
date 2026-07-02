import boom from '@hapi/boom';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import userService from './user.service.js';
const service = new userService();

class AuthService {
  constructor() {}

  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized('Email o contraseña incorrecta');
    }

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized('Email o contraseña incorrecta');
    }

    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token,
    };
  }

  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: Number(config.SMTP_PORT),
      secure: true,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: config.SMTP_FROM,
      to: `${user.email}`,
      subject: 'Recovery Password',
      text: 'Este es un correo enviado desde Nodemailer.',
      html: `
        <h1>Correo de prueba</h1>
        <p>Si recibiste este correo, Nodemailer está funcionando correctamente con la prueba en Node.js y Insomnia desde el endpoint de recuperación.</p>
      `,
    });

    return { message: 'Correo de recuperación enviado' };
  }
}

export default AuthService;
