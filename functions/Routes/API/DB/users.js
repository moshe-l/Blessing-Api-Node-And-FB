const express = require('express');
const router = express.Router();
const BL = require('../../../BL/usersBL');
const nodeMailer = require('nodemailer');


 
router.post('/create', (req, res) => {  
    BL.isUserExists(req.body.Email).then((isUserExists) => {
        if (isUserExists === false)
          return BL.createUser(req.body);             
        else 
          res.send('exists')
        return null;
    }).then((resCreated) => {
        res.json(resCreated);
        return null;
    }).catch((err) => { res.json(err) });
});

router.post('/login', async (req,res) => {
    var a = await BL.logIn(req.body);
    res.json(a);
   // BL.logIn(req.body).then(response => res.json(response)).catch((err) => { res.json(err) });
});

router.post('/forget-password', (req,res) => {
    BL.forgetPassord(req.body.Email).then(response => res.json(response)).catch((err) => { res.json(err) });
  });
  








// for albo site usage.
router.post('/send-email', (req, res) => {  
   
    let transporter = nodeMailer.createTransport({
        service: 'gmail',        
        auth: {
            user: 'mmm129m@gmail.com',
            pass: 'navtkhahc'
        },    
      
    });
    let mailOptions = { 
        from :req.body.from,    
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send(error);
        }
        else{
            res.statusCode= 200;
 
            res.statusMessage = "success"
            res.json({msg : 'Message-sent'});
        }
        
    });
   
});













module.exports = router;
