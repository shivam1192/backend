const jwt = require('jsonwebtoken');
const register = require('./functions/register');
const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const login = require('./functions/login');
const config = require('./config/config');
const {User , validateUser} = require('./models/user');
const {Blog} = require('./models/blog');

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

    router.get('/allUsers' , async(req , res) => {

        let users = {};
        users = await User.find();

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


    router.post('/login',async (req,res)=>{
       // console.log(req.body);
        const email = req.body.email;
		const password = req.body.password;

    

        if(!email || !password || !email.trim() || !password.trim())
        {
            res.status(400).json({message: 'Invalid Request'});
        }
        else
        {
            console.log();
            const response = await login.loginUser(email , password);

            const token = await jwt.sign({ _id: response._id, name: response.name, email: response.email } , config.secret);
            console.log(token);
            // res.setHeader('x-access-token' , token);
            res.status(200).send(token);
        }
        
    });

    router.post('/blog/create',async(req,res)=>{
        const {blog} = req.body;
        const {user} = req.body;
        const title = blog.title;
        const content = blog.content;
        const author = user._id;
        const create = new Blog({
            title,content,author
        })
        try{
                await create.save()
        }catch(err){
            console.log(err)
        }
    })

    router.get('/usermatchblog/:id',async(req,res)=>{
        console.log(req.params.id)
        const all =  Blog.find({author:req.params.id}).then(items=>{
        console.log(`Successfully found ${items.length} documents.`)
        items.forEach((item)=>{
            console.log(item)
            return item;
        })
       })
    })
    router.get('/allpost',async(req,res)=>{
        const al = Blog.find().then(items => {
            console.log(`Successfully found ${items.length} documents.`)
            items.forEach((item)=>{
                console.log(item)
                return item;
            })
          })
         
    })
    module.exports.createPost = (username, newPost, callback)=>{
};
    module.exports = router;