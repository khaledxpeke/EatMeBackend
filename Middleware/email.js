const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'khaledbouajila5481@gmail.com',
    pass: '**********'
  }
});

module.exports = transporter;