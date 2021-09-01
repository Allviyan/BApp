const User = require('../models/user');

var request = require("request");
var md5s = require("md5");
var moment = require("moment");
const _ = require('lodash');
var latestTransactionTimestamp = "";
const wallets = require('../models/wallet')


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
  const { userId, amountP, transaction} = req.body;
  
  User.find({ userId: userId}).exec((err, tag) => {
      if (_.isEmpty(tag)) {
          return res.status(400).json({
              error: 'lookup not found'
          });
      }
      
      wallets.findOne({ ownerID: userId }).exec((err, walletUser) => {
        if (_.isEmpty(walletUser)) {
          return res.status(400).json({
              error: 'lookup not found'
          });
      }
        if (transaction =='OUT') {
          
          User.find({ userId: userId}).exec((err, tag) => {
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
      var externalPlayerId= userId;
      
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
        console.log(body.balance)

          if(body.balance < amountP){
             return res.json({message: 'cannot withdraw wallet, you have insuficient amount'});
          }
      
       

          var requestId = "Pptransfer" + moment().format("x");
          var dateCreated = moment().format("x");
          var updatedBy = userId; 
          var existingLoad = walletUser.balance;
          var balance = (existingLoad + amountP);
          var updateWallet = {dateCreated, updatedBy, balance, requestId}
          wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'cant update user wallet'
                });
            }
  
        });
          
        var API_URL = 'https://api.prerelease-env.biz/IntegrationService/v3/http/CasinoGameAPI' + '/balance/transfer/';
        var secureLogin = "eexim_euroexim";
        var secretKeyHash = "testKey";
        var resd = secureLogin.toLowerCase();
        var secretKey = 'PragmaticPlay';
        var externalPlayerId= userId;
        var transactionPrefix = "TA";
        var externalTransactionId = transactionPrefix + moment().format("x");
        let amount = (amountP * -1);
        
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
      return res.json({message: 'Pragmatic Succesfully withdraw! your new balance is ' + existingLoad, 
      balance : body.balance})
    });
  });
});
        } else {
          console.log("pasok! tite")
      
          if( amountP > walletUser.balance){
            return res.status(400).json({
                ERROR: 'transaction cannot continue because amount requested is higher than existing balance'
            });
        }

        var existingLoad = walletUser.balance;
        var balance = (existingLoad - amountP);
        var requestId = "Pptransfer" + moment().format("x");
        var dateCreated = moment().format("x");
        var updatedBy = userId; 
        var myqueryUserWallet = { ownerID: userId }
        var updateWallet = {dateCreated, updatedBy, balance, requestId}
        wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
          if (err) {
              return res.status(400).json({
                  error: 'cant update user wallet'
              });
          }

      });

        
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
    return res.json({message: 'Pragmatic success Balance transfer! remaining balance is ' + existingLoad, 
    balance : body.balance})
  });
}    
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



