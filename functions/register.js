'use-strict';

const {User , validateUser} = require('../models/user');
const bcrypt = require('bcryptjs');
require('express-async-errors');

exports.registerUser = async (name , email , password) => {
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({

        name: name,
        email: email,
        password: hash

    });

    const user = await newUser.save();

    return user;
}
