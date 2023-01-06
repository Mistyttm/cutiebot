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

async function sendEmail({ to, subject, text, html }) {
    await transporter.sendMail({
        from: EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: html,
    }).then((res) => console.log(res))
        .catch((err) => console.log(err));
}

export default sendEmail;
