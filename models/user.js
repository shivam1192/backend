const Joi = require('joi');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  email: {
    type: String,
    
  },
  password: {
    type: String,
   
  },
});

const User = mongoose.model('User' , userSchema);

function validateUser(User) {
  const Schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email().insensitive(),
    password: Joi.string().min(5).max(255).required(),
  }

  return Joi.validate(User , Schema);
}

exports.User = User;
exports.validateUser = validateUser;