const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'khaledbouajila5481@gmail.com',
    pass: 'xlwjzvtathzeqpwj'
  }
});

module.exports = transporter;