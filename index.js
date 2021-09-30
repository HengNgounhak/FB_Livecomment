const express = require('express');
const ejslayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const app = express();

const router = require('./routes/index');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('layout', 'layouts/layout');
app.use(ejslayouts);

app.use(cookieParser());
app.use(session({
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1h expire
        sameSite: true,
        secure: false
    },
    secret: process.env.SESSION_SECRET,
    name: 'me',
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.cqgou.mongodb.net/FBComment?retryWrites=true&w=majority`)
    .then(result => {
        //         console.log("Db is connected");
        // app.listen(process.env.PORT || 3000);
        const server = https.createServer({ key: key, cert: cert }, app);
        server.listen(3000);
        console.log("https port 3000")
    }).catch(err => {
        console.log(err);
    })