const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const router = express.Router();
require('../db/connectDB')
const User = require('../model/userSchema');

router.get('/',(req, res) => {
    res.send(`Hello World from router`)
});

// router.post('/register', (req, res) => {
//     // console.log(req.body);
//     // res.json({message: req.body});

//     //storing the user data in the database 
//     //using promises

//     //get data  
//     const {name, email, phone, work, password, cpassword} = req.body;

//     //check validation
//     if(!name || !email || !phone || !work || !password || !cpassword)
//     {
//         return res.status(422).json({error: "Please fill the fields properly."});
//     }

//     //email and mobile no. must be unique
//     User.findOne({$or: [{email: email}, {phone: phone} ]})
//     .then((userExists) => {

//         if (userExists) {
//             let duplicateField = userExist.email === email ? "Email" : "Phone";
//             return res.status(422).json({error: `${duplicateField} Already registered.`});
//         }

//         const user = new User({name, email, phone, work, password, cpassword});

//         user.save().then(() => {
//             res.status(201).json({message: "User Registered Successfully."});
//         }).catch((err) => res.status(500).json({error: "Failed to register."}))

//     }).catch(err => {  
//         console.log(err);
//     })
// });

//using async await

router.post('/register', async(req, res) => {
    const {name, email, phone, work, password, cpassword} = req.body;
    if(!name || !email || !phone || !work || !password || !cpassword)
    {
        return res.status(422).json({error: "Please fill the fields properly."});
    }
    try {
        const userExist = await User.findOne({$or: [{email: email}, {phone: phone} ]})
        if (userExist) {
            let duplicateField = userExist.email === email ? "Email" : "Phone";
            return res.status(422).json({error: `${duplicateField} Already registered.`});
        } 
        else if (password != cpassword) {
            return res.status(422).json({error: "Password does not match."}); 
        }
        else {
            const user = new User({name, email, phone, work, password, cpassword});

            const userRegister = await user.save();

            if (userRegister) {
                res.status(201).json({message: "User Registered Successfully"});
            }
        }
    } catch(err) {
        console.log(err);
    }
});

router.post('/signin', async(req, res) => {
    try {
        const {email, password} = req.body;

        //validation
        if(!email || !password) {
            return res.status(422).json({error: "Please fill in all the details properly"})
        }
        //check email and password match with our existing db
        const userLogin = await User.findOne({email: email});
        
        if (userLogin) {
            const isMatch = bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAuthToken();
            //console.log(token);
            //store jwt in cookie
            //res.cookie("cookiename", dataThatWeNeedToStore)
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000), //milli-seconds
                httpOnly: true
            })
            if(!isMatch){
                res.status(400).json({error: "Invalid password"});
            }
            else {
                res.status(200).json({message: "User Signin Successfully"});
            }
        }
        else {
            res.status(400).json({error: "Invalid Email"});
        }
    } catch (error) {
        console.log(`${error}`);
    }
 });

module.exports = router;