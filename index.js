'use strict';

const express = require('express');
const app = express();
const cors=require("cors");
const port = process.env.PORT || 3000 ;       
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes');
const checkToken = require('./functions/checkToken');
const {User , validateUser} = require('./models/user');
require('express-async-errors');

// mongoose.Promise = global.Promise;
// // mongoose.connect('mongodb+srv://shivam1192:9827252555sg@cluster0-jicbh.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true},(errors)=>{
//     if(errors){
//         console.log(errors)
//     }
//     else{
//         console.log("mongoose ready")
//     }
// });

app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use('/api',routes);

app.listen(port);

console.log(`App runs on ${port}`);

