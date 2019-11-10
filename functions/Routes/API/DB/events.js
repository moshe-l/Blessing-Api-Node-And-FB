const express = require('express');
const router = express.Router();
const BL = require('../../../BL/eventsBL');
const session = require('../../../Helpers/session');


router.post('/create', (req , res) =>{
  res.send(session.token + "123");
})

module.exports = router;