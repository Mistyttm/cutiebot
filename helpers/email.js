import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();
const { HOST, EMAIL, EMAILPASS } = process.env;

// Create reusable transporter object using the default SMTP transport
const createTransporter = () =>
    nodemailer.createTransport({
        host: HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: EMAIL,
            pass: EMAILPASS,
        },
    });

// Initialise transporter
const transporter = createTransporter();

// Sorry this is horrific <3
const sendEmail = async ({ to, subject, text, html }) => {
    await transporter.sendMail({
        from: EMAIL, // Sender address
        to: to, // Receiver address
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html,
    }).then((res) => console.log(res))
        .catch((err) => console.log(err));
};

export default sendEmail;
