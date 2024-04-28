import nodemailer from "nodemailer";

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:"465",
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.MAIL,
        to: options?.email,
        subject: options?.subject,
        text: options?.message,
    }
 
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export default sendEmail