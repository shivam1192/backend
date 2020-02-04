const Joi = require('joi');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  otp: {
    type: Number
  }
});

const User = mongoose.model('User' , userSchema);

function validateUser(user) {
  const Schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email().insensitive(),
    password: Joi.string().min(5).max(255).required()
  }

  return Joi.validate(user , Schema);
}

exports.User = User;
exports.validateUser = validateUser;