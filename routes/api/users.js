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

// @route       POST api/users/test
// @description Tests users route
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

module.exports = router;