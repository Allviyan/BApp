const User = require('../models/user');

var request = require("request");
var md5s = require("md5");
var moment = require("moment");
const _ = require('lodash');


exports.getUserBalance = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  let final = []
  User.find({ userId: slug}).exec((err, tag) => {
      if (_.isEmpty(tag)) {
          return res.status(400).json({
              error: 'lookup not found'
          });
      }
      
var API_URL = 'https://api.prerelease-env.biz/IntegrationService/v3/http/CasinoGameAPI' + '/balance/current/';
var secureLogin = "eexim_euroexim";
var secretKeyHash = "testKey";
var reds = 'testKey';
var secretKey = 'PragmaticPlay';
var externalPlayerId= slug;

var stringParam = "currency=" + 'CNY' +
"&externalPlayerId=" + externalPlayerId +
"&secureLogin=" + secureLogin + secretKeyHash;

var hashedKey = md5s(stringParam);


var opts = {
  url: API_URL,
  qs : {
    currency: 'CNY',
    externalPlayerId: externalPlayerId,
    secureLogin: secureLogin,
    hash: hashedKey
  },
  headers:{
    "Content-Type": "x-www-form-urlencoded"
  },
  json: true
};


request.post(opts, function(error, response, body){
    return res.json({message: 'Pragmatic Get Balance!', 
    balance : body.balance})
  });
 });
};


exports.getGameLink = (req, res) => {
  // const slug = req.params.slug.toLowerCase();
  // const gLink = req.params.games;
  const { userId, gameCode} = req.body;

  User.find({ userId: userId}).exec((err, tag) => {
      if (_.isEmpty(tag)) {
          return res.status(400).json({
              error: 'lookup not found'
          });
      }
      
      var API_URL = 'https://api.prerelease-env.biz/IntegrationService/v3/http/CasinoGameAPI' + '/game/start/';
      var secureLogin = "eexim_euroexim";
      var secretKeyHash = "testKey";
      var resd = secureLogin.toLowerCase();
      var secretKey = 'PragmaticPlay';
      var externalPlayerId= userId;
      var transactionPrefix = "TA";
      var externalTransactionId = transactionPrefix + moment().format("x");
      var amount = 1000;
      var cashierURL = 'cashier.php';
      //var gameId = 'vs25hotfiesta';
      var gameId = gameCode;
      var platform ="WEB";
      var language = "EN";
      var lobbyURL = 'lobby.php';
      var stringParam ="cashierURL=" + cashierURL +
                      "&externalPlayerId=" + externalPlayerId +
                      "&gameId=" + gameId +
                      "&language=" + language +
                      "&lobbyURL=" + lobbyURL +
                      "&platform=" + platform +
                      "&secureLogin=" + resd + secretKeyHash;
      
      var hashedKey = md5s(stringParam);
      
      
      var opts = {
        url: API_URL,
        qs : {
          cashierURL:cashierURL,
          externalPlayerId:externalPlayerId,
          gameId:gameId,
          language:language,
          lobbyURL:lobbyURL,
          platform:platform,
          secureLogin:secureLogin,
          hash:hashedKey
        },
        headers:{
          "Content-Type": "x-www-form-urlencoded"
        },
        json: true
      };


request.post(opts, function(error, response, body){
    return res.json({message: 'Pragmatic Get Game Link!', 
    gameLink : body.gameURL})
  });
 });
};



