const User = require('../models/user');

var request = require("request");
var md5s = require("md5");
var moment = require("moment");
const _ = require('lodash');
var latestTransactionTimestamp = "";
const gameTransaction = require('../models/gameTransaction');


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


exports.reloadBalancePP = (req, res) => {
  const { userId, amountP} = req.body;
  
  User.find({ userId: userId}).exec((err, tag) => {
      if (_.isEmpty(tag)) {
          return res.status(400).json({
              error: 'lookup not found'
          });
      }
      
      var API_URL = 'https://api.prerelease-env.biz/IntegrationService/v3/http/CasinoGameAPI' + '/balance/transfer/';
      var secureLogin = "eexim_euroexim";
      var secretKeyHash = "testKey";
      var resd = secureLogin.toLowerCase();
      var secretKey = 'PragmaticPlay';
      var externalPlayerId= userId;
      var transactionPrefix = "TA";
      var externalTransactionId = transactionPrefix + moment().format("x");
      var amount = amountP;
      
      var stringParam = "amount=" + amount +
      "&externalPlayerId=" + externalPlayerId +
      "&externalTransactionId=" + externalTransactionId +
      "&secureLogin=" + resd + secretKeyHash;
      // var stringParam = "currency=" + 'CNY' +
      // "&externalPlayerId=" + externalPlayerId +
      // "&secureLogin=" + secureLogin + secretKeyHash;
      
      var hashedKey = md5s(stringParam);
      
      
      var opts = {
        url: API_URL,
        qs : {
          amount: amount,
          externalPlayerId: externalPlayerId,
          externalTransactionId: externalTransactionId,
          secureLogin: resd,
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


exports.getGameTransaction = (req, res) => {
  // const slug = req.params.slug.toLowerCase();
  // const gLink = req.params.games;
      var secureLogin = "eexim_euroexim";
      var password = "testKey";
      var now = moment().subtract(1, 'minutes');
      var currTimestamp = now.format('x');
      console.log("dasda   " + currTimestamp)
      var stringParam = "?login=" + secureLogin + "&password=" + password + "&timepoint=" + currTimestamp;

      var API_URL = 'http://api.prerelease-env.biz/IntegrationService/v3/DataFeeds/transactions' + stringParam;
            
      
      var opts = {
        url: API_URL,
        qs : {
        },
        headers:{
          "Content-Type": "x-www-form-urlencoded"
        },
        json: true
      };

      request.get(opts, function(err, data){
        var pragmatic = data.body && typeof data.body == "string" ? data.body.split('\n') : [];
        if (pragmatic.length == 0) return;
        var timestamp = pragmatic[0].split("=")[1];
        if (!timestamp) return;
        pragmatic.splice(0,2);
        
          for (let val of pragmatic) {
        if (val != ""){

          var record = val.split(",");
          let playerID = record[0];
          let extPlayerID = record[1];
          let gameID = record[2];
          let playSessionID = record[3];
          let timestamp = record[4];
          let referenceID = record[5];
          let type = record[6];
          let amount = record[7];
          let currency = record[8];

          console.log({ playerID, extPlayerID, gameID, playSessionID, timestamp, referenceID, type, amount, currency})
         
          let dasda = {
            playerID: '2669256',
            extPlayerID: '638699556',
            gameID: 'vs5drhs',
            playSessionID: '2685124019',
            timestamp: '1629717788000',
            referenceID: '2685124019_0_b',
            type: 'B',
            amount: '12.00',
            currency: 'CNY'
          }
          let completeId = new gameTransaction(dasda);

          completeId.save((err, data) => {
              if (err) {
                  return res.status(400).json({
                      error: err.errmsg
                  });
              }

          });
          res.json({message: 'game transaction inserted!'})
        } 
          if (val[0] == "") latestTransactionTimestamp = timestamp;
          res.json({message: 'No game transaction!'})
        
      

  }

        
       });
};

