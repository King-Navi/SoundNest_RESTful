const nodemailer = require('nodemailer');

const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

if (!EMAIL_ACCOUNT || !EMAIL_PASSWORD) {
    throw new Error(
        '[emailConfig.js] EMAIL_ACCOUNT or EMAIL_PASSWORD is missing in .env file'
    );
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ACCOUNT,
        pass: EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('[emailConfig.js] Failed to connect to email server:', error);
    }
});

module.exports = transporter;