const nodemailer = require('nodemailer');

const sendMail = async ({recipient, subject, message, htmlTemplate}) => {
   const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 25,
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASSWORD,
      },
   });

   await transporter.sendMail({
      from: '"Oyefule Oluwatayo 👻" <hello.natours@hoyeh.com>',
      to: recipient,
      subject: subject,
      text: message,
      // html: htmlTemplate,
   });
}

module.exports = sendMail;
