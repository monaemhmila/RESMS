    const nodemailer = require('nodemailer');

    // Function to send an email
    const sendEmail = async (to, subject, text, html) => {
        try {
            if (to && process.env.user && process.env.pass) {
                const transporter = nodemailer.createTransport({
                    pool: true,
                    host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "jemsit.service@gmail.com", // generated ethereal user
        pass: "qfyr uiks hfal vbyl", // generated ethereal password
      },
                    tls: {
                        rejectUnauthorized: false // Ignore les erreurs de certificat (option de dernier recours)
                    }
                });
                
                
                const mailOptions = {
                    from: process.env.user,
                    to: to,
                    subject: subject,
                    text: text,
                    html: html
                };

                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
                return info.response;
            }
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    };


    module.exports = { sendEmail }