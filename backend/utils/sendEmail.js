const { model } = require("mongoose");
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text)=>{
    try{
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      
      

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });

      console.log("Reminding email sent");

    }
    catch(error){
        console.log("error in sending email",error);
    }
};

module.exports = sendEmail;
