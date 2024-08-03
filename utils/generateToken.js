const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const generateToken = (user)=>{
    return jwt.sign({ email: user.email}, process.env.JWT_KEY);
}

const sendMail = (user)=>{
    const auth = nodemailer.createTransport({
        service: "gmail",
        secure : true,
        port : 465,
        auth: {
            user: "hassaanmalik077@gmail.com",
            pass: "jdglnwnnqrjyzkoi"

        }
    });

    const receiver = {
        from : "hassaanmalik077@gmail.com",
        to : `${user.email}`,
        subject : "Account registration",
        text : `Hello ${user.name}, Thanks for getting started with MindPad.`
    };

    auth.sendMail(receiver, (error, emailResponse) => {
        if(error) throw error;
        console.log("success!");
        response.end();
    });
}

module.exports = {generateToken,
    sendMail
}