import boom from '@hapi/boom';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import userService from './user.service.js';
const service = new userService();

class AuthService {
  constructor() {}

  /**
   * Authenticates a user with email and password credentials.
   *
   * @param {string} email - User email used as login identifier.
   * @param {string} password - Plain text password received from the request.
   * @returns {Promise<import('sequelize').Model>} Authenticated user without password or recovery token in dataValues.
   * @throws {import('@hapi/boom').Boom} When the email does not exist or the password does not match.
   */
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

  /**
   * Builds a JWT for an authenticated user.
   *
   * @param {{ id: number, role: string }} user - User returned by the local authentication strategy.
   * @returns {{ user: object, token: string }} Response payload with the user data and signed token.
   */
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

  /**
   * Generates a short-lived recovery token, stores it on the user and sends a recovery email.
   *
   * @param {string} email - Email address associated with the account to recover.
   * @returns {Promise<{ message: string }>} Result message returned after sending the email.
   * @throws {import('@hapi/boom').Boom} When no user exists for the provided email.
   */
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

  /**
   * Changes a user's password when the recovery token is valid and matches the stored token.
   *
   * @param {string} token - JWT recovery token previously stored on the user record.
   * @param {string} newPassword - New plain text password to hash and persist.
   * @returns {Promise<{ message: string }>} Confirmation message.
   * @throws {import('@hapi/boom').Boom} When the token is invalid, expired or does not match the stored token.
   */
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

  /**
   * Sends an email using the SMTP configuration loaded from environment variables.
   *
   * @param {import('nodemailer').SendMailOptions} infoMail - Email payload accepted by Nodemailer.
   * @returns {Promise<{ message: string }>} Confirmation message after Nodemailer sends the email.
   * @throws {Error} When SMTP verification or email delivery fails.
   */
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
