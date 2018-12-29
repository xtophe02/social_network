const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs')

// Load User model
const User = require('../../models/User')

// @route       GET api/users/test
// @description Tests users route
// @access      Public
router.get('/test', (req, res) => res.json({
  msg: 'Users Works'
}));

// @route       POST api/users/regiter
// @description Register user
// @access      Public
router.post('/register', (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'Email already exists'
        })
      } else {
        // make avatar
        const avatar = gravatar.url(req.body.email, {
          s: '200', //size
          r: 'pg', //rating
          d: 'mm' //default
        })
        // make new user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password,
        })
        //encrypt password
        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
});

// @route       POST api/users/login
// @description Login user / returning jsonWebToken token
// @access      Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({
      email: email
    })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          msg: 'User not found'
        })
      }
      // check password
      bcryptjs.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            res.json({
              msg: 'Success'
            })
          } else {
            return res.status(400).json({
              password: 'Password incorrect'
            })
          }
        })
    })
});

module.exports = router; {
  email: 'User not found'
}