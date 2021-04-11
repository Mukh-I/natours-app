const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.firsName = user.name.split(' ')[0];
    this.from = `Mukhtar Ismail <${process.env.EMAIL_FROM}>`;
    this.to = user.email;
    this.url = url;
  }

  newTransport() {
    // Create a transporter
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'sendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firsName,
      url: this.url,
      subject
    });
    // Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.fromString(html),
      html
    };

    // send the email to user
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours family!!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token ( valid for 10 minutes!)'
    );
  }
};
