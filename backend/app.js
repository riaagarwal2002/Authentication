require('dotenv').config();
//require express
const express = require('express');

//create a variable to access express methods and properties
const app = express();

const PORT = process.env.PORT;

//require db
require(`./db/connectDB`);
app.use(express.json());

app.use(require('./routes/auth'));

const mongoose = require ('mongoose');

const DB = process.env.DATABASE;

const middleware = (req, res, next) => {
    console.log(`Hello middleware`)
    next();
}

//app.get(path,callback)
app.get('/',(req, res) => {
    res.send(`Hello World!`)
});

app.get('/about', middleware, (req, res) => {
    res.send(`About`)
});

app.get('/contact',(req, res) => {
    res.send(`Contact`)
});

app.get('/signin',(req, res) => {
    res.send(`Sign in`)
});

app.get('/signup',(req, res) => {
    res.send(`Sign up`)
});

//create a server using listen method
//app.listen(PORT, callback)
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
});
