const Joi = require('joi');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author:{
    type:String,
    required:true
  }
  });

const Blog = mongoose.model('Blog' , blogSchema);

function validateBlog(Blog) {
  const blogSchema = {
    title: Joi.string().min(5).max(50).required(),
    content: Joi.string().min(5).required(),
    author: Joi.string().min(5).required()
  }

  return Joi.validate(Blog , blogSchema);
}

exports.Blog = Blog;
exports.validateBlog = validateBlog;