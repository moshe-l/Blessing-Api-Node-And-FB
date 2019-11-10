const functions = require('firebase-functions');
const express = require('express');
const app = express();
var session = require('express-session');

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');  
    res.setHeader('Access-Control-Allow-Credentials', true); 
    next();
});

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret"
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./Routes/API/DB/users'));
app.use('/api/events', require('./Routes/API/DB/events'));

exports.app = functions.https.onRequest(app);
