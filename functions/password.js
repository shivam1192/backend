'use strict';

const otpGenerator = require('otp-generator');
const config = require('../config/config.json');
const {User , validateUser} = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

exports.resetPasswordInit = async (email) => {

    const currentUser = await User.findOne({email: email});

    if(!currentUser)
    {
        const response = {
            status: 404,
            message: 'User Not Found'
        };
        return response;
    }
    else
    {
        currentUser.otp = otpGenerator.generate(6, {alphabets: false , upperCase: false , specialChars: false});
        console.log(currentUser);
        const result = await currentUser.save();
        
        const transporter = nodemailer.createTransport(`smtps://${config.email}:${config.password}@smtp.gmail.com`);
        const mailOptions = {

            from:`"${config.name}" <${config.email}>`,
            to: currentUser.email,
            subject: 'Reset Password Request',
            html: `Hello ${currentUser.name},<br/>
                    Your Reset password token is <b>${currentUser.otp}</b>.<br/>
                
                Thanks,<br/>
                Customer Support.`
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(info);
        const response = {
            status: 200,
            message: 'Check mail for instructions'
        };

        return response;
   
    }
}

exports.resetPasswordFinal = async(email , token , newPassword) => {

    let currentUser = await User.findOne({email: email});
    
    if(currentUser.otp === token) 
    {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        currentUser.password = hash;
        currentUser.otp = null;
        await currentUser.save();

        let response = {
            status: 200,
            message: 'Password Changed Successfully'
        }

        return response;
    }
    else
    {
        let response = {
            status: 401,
            message: 'Invalid Token'
        }

        return response;
    }
}
