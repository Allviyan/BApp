var request = require("request");
var md5 = require("crypto-js/md5");
var md5s = require("md5");
var moment = require("moment");
const _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://kargaAdmin:123456Y@karga-byddr.mongodb.net/";
var latestTransactionTimestamp = "";

var secureLogin = "eexim_euroexim";
var secretKeyHash = "testKey";
var password = "testKey";
var res = secureLogin.toLowerCase();
var secretKey = 'PragmaticPlay';
var externalPlayerId= '333';
var now = moment();
// var currTimestamp = now.format('x');
// var dateTime = results.getLatestTimestamp;

// var link = pragmatic.transactionUrl + stringParam;
var now = moment().subtract(1, 'minutes');
var currTimestamp = now.format('x');
console.log("dasda   " + currTimestamp)
var stringParam = "?login=" + secureLogin + "&password=" + password + "&timepoint=" + currTimestamp;

var API_URL = 'http://api.prerelease-env.biz/IntegrationService/v3/DataFeeds/transactions' + stringParam;

// var stringParam = "currency=" + 'CNY' +
// "&externalPlayerId=" + externalPlayerId +
// "&secureLogin=" + secureLogin + secretKeyHash;

var hashedKey = md5s(stringParam);


var opts = {
  url: API_URL,
  qs : {
  },
  headers:{
    "Content-Type": "x-www-form-urlencoded"
  },
  json: true
};

// request.post(opts, function(err, result) {
//   if (err) {
//     console.log("Pragmatic@addUser - error on post ", err);
//   }
//   console.log(result);
  

// });

request.get(opts, function(err, data){
  var pragmatic = data.body && typeof data.body == "string" ? data.body.split('\n') : [];
  if (pragmatic.length == 0) return;
  var timestamp = pragmatic[0].split("=")[1];
  if (!timestamp) return;
  pragmatic.splice(0,2);

  var result = pragmatic;
  var timestamp = timestamp;

  var props = {
    playerID: "",
    extPlayerID: "",
    gameID: "",
    playSessionID: "",
    timestamp: "",
    referenceID: "",
    type: "",
    amount: "",
    currency: ""
  };
  _.forEach(result, function (obj) {
    if (obj != "") {
      var record = obj.split(",");
      props.playerID = record[0];
      props.extPlayerID = _.toUpper(record[1]);
      props.gameID = record[2];
      props.playSessionID = record[3];
      props.timestamp = record[4];
      props.referenceID = record[5];
      props.type = record[6];
      props.amount = record[7];
      props.currency = record[8];

      var fieldNames = ['playerID', 'extPlayerID', 'gameID', 'playSessionID', 'timestamp', 'referenceID', 'type', 'amount', 'currency'];
      for (var i = 0; i < props.length; i++) props[fieldNames[i]] = props[i];
      console.log("check! :" + JSON.stringify(props))
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("gamingEuro");
        dbo.collection("gameTransaction").insertMany([props], function(err, res) {
          if (err) throw err;
          console.log("Inserted Logs");
          db.close();
        });
      });
      
    console.log('inserted successfully: ' + props)
  // } 
    }

    
  });

 });