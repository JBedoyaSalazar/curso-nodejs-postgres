import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

/**
 * Demonstrates SMTP verification and email delivery with the project's Nodemailer config.
 *
 * @returns {Promise<void>}
 */
async function sendMail() {
  try {
    console.log({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      user: config.SMTP_USER,
    });

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

    console.log('✅ Conexión SMTP exitosa.');

    const info = await transporter.sendMail({
      from: config.SMTP_FROM,
      to: config.SMTP_TO,
      subject: 'Un Correo para mi bebe preciosa',
      text: 'Este es un correo enviado desde Nodemailer.',
      html: `
        <h1>Correo de prueba</h1>
        <p>Si recibiste este correo, Nodemailer está funcionando correctamente.</p>
        <h1 style="color: #e64a4a;">¡Hola, mi amor!</h1>
        <p>Este es un correo de prueba enviado desde Nodemailer.</p>
        <p>¡Espero que tengas un día maravilloso!</p>
        <p>Con cariño,</p>
        <p>Tu amorcito</p>
        <p>❤️</p>
      `,
    });

    console.log('Correo enviado.');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error(error);
  }
}

sendMail();
