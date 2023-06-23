const mongoose = require('mongoose');
const Reservation = require('../models/reservation');
const nodemailer = require('nodemailer');
mongoose.connect('mongodb+srv://khaledbouajila5481:test123@cluster0.4rettyx.mongodb.net/eatme', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function sendReminderEmail(reservation) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'khaledbouajila5481@gmail.com',
        pass: 'xlwjzvtathzeqpwj'
      }
    });
  
    const mailOptions = {
      from: 'khaledbouajila5481@gmail.com',
      to: reservation.email,
      subject: "Don't forget your reservation tomorrow!",
      text: `Hi ${reservation.fullName}, This is a reminder that you have a reservation tomorrow at ${reservation.time}.`
    };
  
    const result = await transporter.sendMail(mailOptions);
  
    console.log(`Reminder email sent to ${reservation.email}: ${result.response}`);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  async function remindReservations() {
    const reservations = await Reservation.find({
      reminder: true,
      date: tomorrow.toISOString().slice(0, 10),
      time: { $gt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    });
  
    console.log(`Found ${reservations.length} reservations to remind.`);
  
    for (const reservation of reservations) {
      await sendReminderEmail(reservation);
    }
  
    mongoose.connection.close();
  }
  
  remindReservations();