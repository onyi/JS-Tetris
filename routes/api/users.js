const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const keys = require('../../config/keys');

const User = require('../../models/User');

const validateLogin = require('../../validation/login');
const validateSignup = require('../../validation/signup');

router.get('/test', (req, res) => {
  res.json({ msg: "Helloworld"});
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) return res.status(400).json(errors);

  let username = req.body.username;
  let password = req.body.password;

  console.log(`Password: ${password}`)

  User.findOne( {username} )
    .then( user => {
      if(!user) {
        errors.username = 'Username not found';
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then( isMatch => {
          if(isMatch) {
            let payload = { id: user.id, username: user.username};

            jwt.sign(
              payload, 
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              }
            );
          }
          else{
            errors.password = 'Password is incorrect...';
            return res.status(400).json(errors);
          }
        })

      });


});

router.post("/signup", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  const { errors, isValid } = validateSignup(req.body);

  if(!isValid) return res.status(400).json(errors);

  User.find({ username, email })
    .then( user => {
      if(user && user.username === username) {
        errors.username = "Username already exists!"
        return res.status(400).json(errors)
      }
      else if(user && user.email === email) {
        errors.email = "Email has already been registered!"
        return res.status(400).json(errors)
      }
      else{ //No duplicated user exists, proceed
        let newUser = new User({
          username,
          password,
          email
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
              jwt.sign({
                id: user.id,
                username: user.username
              }, 
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
            })
            .catch(err => {
              console.log(`error when creating new user: ${err}`)
              return res.status(500).json(err);
            });
          });
        });
      }

    })
});

module.exports = router;