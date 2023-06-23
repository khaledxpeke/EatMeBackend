const User = require("../models/user");
const Reservation = require("../models/reservation");
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
app.use(express.json());
const cron = require('node-cron');
const transporter = require('../Middleware/email');
const moment = require('moment');

exports.addReservation = async (req, res, next) => {
  const { people, fullName, email,address, phone, date, time,reminder } = req.body;
  try {
    const reservation = await Reservation.create({
      people,
      fullName,
      email,
      address,
      phone,
      date,
      time,
      reminder,
    });
    res.status(201).json({
      reservation: reservation,
    });
  } catch (error) {
    res.status(400).json({
      message: "Some error occured",
      error: error.message,
    });
  }
};

exports.getAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({});
        res.status(200).json({
        reservations,
        });
    } catch (error) {
        res.status(400).json({
        message: "No Reservations found",
        error: error.message,
        });
    }
    }

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.status(200).json({
        reservation,
        });
    } catch (error) {
        res.status(400).json({
        message: "No Reservation found",
        error: error.message,
        });
    }
    }

cron.schedule('54 0 * * *', async () => {
        // Get all reservations that are 1 day away from the current date
        const tomorrow = moment().add(1, 'day').startOf('day').utcOffset(+2);
        const reservations = await Reservation.find({
          reminder: true,
          date: tomorrow.toISOString().slice(0, 10)
          },
         
        );
        console.log(reservations);
        const currentTime = new Date();
        const filteredReservations = reservations.filter(reservation => {
            const reservationTime = moment.tz(`${reservation.date}T${reservation.time}:00`, 'YYYY-MM-DDTHH:mm:ss', 'YOUR_TIMEZONE_HERE').toDate();
            const currentTime = moment.tz(new Date(), 'YOUR_TIMEZONE_HERE').toDate();
            return reservationTime > currentTime;
          });
        console.log('Found reservations:', filteredReservations );
        // Send reminders for each reservation
        for (const reservation of filteredReservations) {
            const reservationTime = new Date(`${reservation.date}T${reservation.time}:00`);
            console.log(`Current time: ${currentTime}`);
            console.log(`Reservation time: ${reservationTime}`);
          if (reservation.reminder !== false) {
            try {
                // Send email to the user's email address
                await transporter.sendMail({
                  from: 'khaledbouajila5481@gmail.com',
                  to: reservation.email,
                  subject: 'Don\'t forget your reservation tomorrow!',
                  text: 'Hi ' + reservation.fullName + ',\n\nThis is a reminder that you have a reservation tomorrow at ' + reservation.time + '.\n\nThanks!'
                });
              } catch (err) {
                console.error(err);
              
          }}
        }
      });