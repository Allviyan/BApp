const User = require('../models/thirdParty');
const expressJwt = require('express-jwt');

const jwt = require('jsonwebtoken');
const { put } = require('../routes/auth');
const wallets = require('../models/wallet')

exports.signup = (req, res) => {
  // console.log(req.body);
  User.findOne({ username: req.body.username }).exec((err, user) => {
      if (user) {
          return res.status(400).json({
              error: 'Username is taken'
          });
      }

      const { companyName, email,username,password  } = req.body;
     
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;
      let Createdat = new Date().getTime();
      let newUser = new User({ companyName, email,username,password });
      newUser.save((err, success) => {
          if (err) {
              return res.status(400).json({
                  error: err
              });
          }
          // res.json({
          //     user: success
          // });
          res.json({
              message: 'Signup success! Please signin.'
          });
      });
  });
};

exports.signin = (req, res) => {
  const { username, password } = req.body;
  let refreshTokens = []
  // check if user exist
  User.findOne({ username }).exec((err, user) => {
      console.log("dasda", user)
      if (err || !user) {
          return res.status(400).json({
              error: 'Username does not exist. Please signup.'
          });
      }

      // generate a token and send to client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
  refreshTokens.push(refreshToken);
      res.cookie('token', token);
      const { _id, username, name, email } = user;
      return res.json({
          token,
          user: { _id, username, name, email }
      });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
      message: 'Signout success'
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET
});

//  

exports.getOneUserWallet = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  wallets.findOne({ ownerID: slug }).exec((err, allUser) => {
      if (err) {
          return res.status(400).json({
              error: 'inventory not found'
          });
      }

      let userId = allUser.ownerID;
      let balance = allUser.balance;

      res.json({
          "identifier": "get One user wallet", userId, balance
      });
});
};