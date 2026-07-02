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
    delete user.dataValues.recoveryToken;
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

  async sendRecoveryPassword(email){
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const payload = {
      sub: user.id
    }

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '10min' });
    const link = `http://myfrontend.com/recovery?token=${token}`;

    await service.update(user.id, { recoveryToken: token });

    const mail ={
      from: config.SMTP_FROM,
      to: `${user.email}`,
      subject: 'Email de recuperación de contraseña',
      html: `
        <h1>Ingresa al siguiente link para recuperar la contraseña</h1>
        <a href="${link}" target="_blank">Recuperar contraseña</a>
        <p>Este link solo estará disponible por 10 minutos</p>
      `,
    }

    const res = await this.sendMail(mail)
    return res;
  }

  async changePassword(token, newPassword){
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);

      if(user.recoveryToken !== token){
        throw boom.unauthorized();
      }

      const hashedPassword = await bycrypt.hash(newPassword, 10);
      await service.update(user.id, { password: hashedPassword, recoveryToken: null });
      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {


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

    await transporter.sendMail(infoMail);

    return { message: 'Correo de recuperación enviado' };
  }
}

export default AuthService;
