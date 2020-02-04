const jwt = require('jsonwebtoken');
const register = require('./functions/register');
const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const login = require('./functions/login');
const config = require('./config/config');
const {User , validateUser} = require('./models/user');
const authorize = require('./functions/checkToken');
const Password = require('./functions/password');
require('express-async-errors');

    router.get('/' , async(req,res) => {
        res.send('Welcome to Auth server');
    });

    router.get('/users' , authorize , async(req , res) => {

        let users = {};
        users = await User.find({_id: { $ne: req.body._id}}).select({_id: 1 , name: 1});

        res.send(users);

    });

    router.post('/register' , async(req,res) => {

        const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;

		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

            res.status(400).json({message: 'Invalid Request !'});
        }

        else
        {
            const user = await register.registerUser(name , email , password);
            console.log(user);

            res.send(user);
            
            
        }

    });

    router.post('/authenticate' , async(req,res) => {

        const credentials = auth(req);

        if(!credentials)
        {
            res.status(400).json({message: 'Invalid Request'});
        }
        else
        {
            console.log(credentials);
            const response = await login.loginUser(credentials.name , credentials.pass);

            const token = jwt.sign({ _id: response._id } , config.secret);
            res.setHeader('x-access-token' , token);
            res.status(200).send(response);
        }
        
    });

    router.post('/users/request/forgetPassword' , async(req , res) => {

        let response = await Password.resetPasswordInit(req.body.email);
        
        res.send(response);
    });

    router.post('/users/finalize/forgetPassword' , async(req,res) => {

        let response = await Password.resetPasswordFinal(req.body.email , req.body.token , req.body.newPassword);
        
        res.send(response);
    });

    module.exports = router;