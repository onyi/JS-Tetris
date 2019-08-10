const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ msg: "Helloworld"});
});

router.post("login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

});

router.post("signup", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
});


module.exports = router;