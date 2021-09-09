const User = require('../models/thirdParty');
const expressJwt = require('express-jwt');
const RequestWallets = require('../models/wallet_transaction')
const userS = require('../models/user');

const jwt = require('jsonwebtoken');
const { put } = require('../routes/auth');
const wallets = require('../models/wallet');
const e = require('express');
const _ = require('lodash');
var moment = require("moment");

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

  exports.walletsUserBet = (req, res) => {

    const { playerID, amount } = req.body;
    userS.findOne({ userId: playerID }).exec((err, user) => {
        
        if (_.isEmpty(user)) {
            return res.status(400).json({
                err: 'User not found'
            });
        }
    })
    wallets.findOne({ ownerID: playerID }).exec((err, walletUser) => {   
        console.log("check " + walletUser)  

              if( amount > walletUser.balance){
                return res.status(400).json({
                    err: 'transaction cannot continue because amount requested is higher than existing balance'
                });
            } 

        var transactionPrefix = "PP-User-Bet";
        var type = transType;
        var referenceNumber = transactionPrefix + moment().format("x");
        var transactionDate  = moment().format("x");
        var owner = user.firstName + " " + user.lastName
         var walletId = playerID;
         var dateCreated = moment().format("x");
         var requestId = "Pragmatic" + moment().format("x");
         var updatedBy = 'pragmatic-seamless'; 
         var balance = (existingLoad - user.amount);
         var myqueryUserWallet = { ownerID: playerID }
         var updateWallet = {dateCreated, updatedBy, balance, requestId}
      
      let completeId = new RequestWallets({ referenceNumber, type, walletId, amount, owner, transactionDate });
  
  
      completeId.save((err, data) => {
          if (err) {
              return res.status(400).json({
                  error: err.errmsg
              });
          }
          console.log(err)


          wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'cant update user wallet'
                });
            }

        });

          res.json('Success : Deduct wallet via Bet!'); // dont do this res.json({ tag: data });
      });
    });
}


  exports.walletsUserBetWin = (req, res) => {

    const { playerID, amount, transType } = req.body;
    userS.findOne({ userId: playerID }).exec((err, user) => {
        console.log("check " + transType) 
        if (_.isEmpty(user)) {
            return res.status(400).json({
                err: 'User not found'
            });
        }

        wallets.findOne({ ownerID: playerID }).exec((err, walletUser) => {   
            console.log("check " + walletUser)  
         
             if(transType === 'Result'){
                var transactionPrefix = "PP-User-Result";
                var type = transType;
                var existingLoad = walletUser.balance || 0;
                console.log("dasdsa " + existingLoad + user.amount)
                var referenceNumber = transactionPrefix + moment().format("x");
                var transactionDate  = moment().format("x");
                var owner = user.firstName + " " + user.lastName
                var walletId = playerID;
                var dateCreated = moment().format("x");
                var requestId = "Pragmatic" + moment().format("x");
                var updatedBy = 'pragmatic-seamless'; 
                var balance = (existingLoad + amount);
                var myqueryUserWallet = { ownerID: playerID }
                var updateWallet = {dateCreated, updatedBy, balance, requestId}
                console.log( "daca " +JSON.stringify(myqueryUserWallet) + JSON.stringify(updateWallet))
                //var referenceTransactionId = 'Uwr' + String(date.getTime()).substring( 4 );
                
                let completeId = new RequestWallets({ referenceNumber, type, walletId, amount, owner, transactionDate });
        
        
                completeId.save((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: err.errmsg
                        });
                    }
                    console.log(err)
        
                    wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'cant update user wallet'
                            });
                        }
            
                   
        
                    res.json('Success : Added user wallets via Result'); // dont do this res.json({ tag: data });
                });
            });
     } else if(transType === 'BonusWin'){
        var transactionPrefix = "PP-User-BonusWin";
        var type = transType;
        var existingLoad = walletUser.balance || 0;
        var referenceNumber = transactionPrefix + moment().format("x");
        var transactionDate  = moment().format("x");
        var owner = user.firstName + " " + user.lastName
         var walletId = playerID;
         var dateCreated = moment().format("x");
         var requestId = "Pragmatic" + moment().format("x");
         var updatedBy = 'pragmatic-seamless'; 
         var balance = (existingLoad + amount);
         var myqueryUserWallet = { ownerID: playerID }
         var updateWallet = {dateCreated, updatedBy, balance, requestId}
         let completeId = new RequestWallets({ referenceNumber, type, walletId, amount, owner, transactionDate });
  
  
      completeId.save((err, data) => {
          if (err) {
              return res.status(400).json({
                  error: err.errmsg
              });
          }


          wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'cant update user wallet'
                });
            }

            res.json('Success : Added wallet via BonusWin!'); // dont do this res.json({ tag: data });
        });  
      });


      }else if(transType === 'JackpotWin'){
        var transactionPrefix = "PP-User-JackpotWin";
        var type = transType;
        var existingLoad = walletUser.balance || 0;
        var referenceNumber = transactionPrefix + moment().format("x");
        var transactionDate  = moment().format("x");
        var owner = user.firstName + " " + user.lastName
         var walletId = playerID;
         var dateCreated = moment().format("x");
         var requestId = "Pragmatic" + moment().format("x");
         var updatedBy = 'pragmatic-seamless'; 
         var balance = (existingLoad + amount);
         var myqueryUserWallet = { ownerID: playerID }
         var updateWallet = {dateCreated, updatedBy, balance, requestId}
      
      let completeId = new RequestWallets({ referenceNumber, type, walletId, amount, owner, transactionDate });
  
  
      completeId.save((err, data) => {
          if (err) {
              return res.status(400).json({
                  error: err.errmsg
              });
          }
          console.log(err)


          wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'cant update user wallet'
                });
            }

          res.json('Success : Added load JackpotWin!'); // dont do this res.json({ tag: data });
      });
    });

      }else{
        var transactionPrefix = "PP-User-PromoWin";
        var type = transType;
        var existingLoad = walletUser.balance || 0;
        var referenceNumber = transactionPrefix + moment().format("x");
        var transactionDate  = moment().format("x");
        var owner = user.firstName + " " + user.lastName
         var walletId = playerID;
         var dateCreated = moment().format("x");
         var requestId = "Pragmatic" + moment().format("x");
         var updatedBy = 'pragmatic-seamless'; 
         var balance = (existingLoad + amount);
         var myqueryUserWallet = { ownerID: playerID }
         var updateWallet = {dateCreated, updatedBy, balance, requestId}
      
      let completeId = new RequestWallets({ referenceNumber, type, walletId, amount, owner, transactionDate });
  
  
      completeId.save((err, data) => {
          if (err) {
              return res.status(400).json({
                  error: err.errmsg
              });
          }

          wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
            if (err) {
                return res.status(400).json({
                    error: 'cant update user wallet'
                });
            }

          res.json('Success : Added load via PromoWin!'); // dont do this res.json({ tag: data });
      });
    });

      }     
});


});

};

exports.walletsUserRefund = (req, res) => {

    const { playerID, amount, transType } = req.body;
    User.findOne({ userId: playerID }).exec((err, user) => {
        
        if (_.isEmpty(user)) {
            return res.status(400).json({
                err: 'User not found'
            });
        }

  
        wallets.findOne({ ownerID: playerID }).exec((err, walletUser) => {   
        
            var transactionPrefix = "PP-User-Refund";
            var type = transType;
            var existingLoad = walletUser.balance || 0;
            var referenceNumber = transactionPrefix + moment().format("x");
            var transactionDate  = moment().format("x");
            var owner = user.firstName + " " + user.lastName
            var walletId = playerID;
            var dateCreated = moment().format("x");
            var requestId = "Pragmatic" + moment().format("x");
            var updatedBy = 'pragmatic-seamless'; 
            var balance = (existingLoad - user.amount);
            var myqueryUserWallet = { ownerID: playerID }
            var updateWallet = {dateCreated, updatedBy, balance, requestId}

            let completeId = new RequestWallets({ referenceNumber, type, walletId, amount, owner, transactionDate });
    
    
            completeId.save((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: err.errmsg
                    });
                }
                console.log(err)
    
                wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'cant update user wallet'
                        });
                    }
        
                });
    
                res.json('Success : User Successfully Refunded!'); // dont do this res.json({ tag: data });
            });
          
        });
    });
};


exports.updatePlayerWalletProvider = (req, res) => {
    const slug = req.params.slug;

    RequestWallets.findOne({ referenceNumber: slug }).exec((err, user) => {
        if (_.isEmpty(user)) {
            return res.status(400).json({
                err: 'transaction not found'
            });
        }
            
        if(user.status =='Granted!'){
            return res.status(400).json({
                err: 'transaction cannot be updated that has been granted!'
            });
        }

        if(user.type =='Withdraw') {
                var userWalletId = (user.walletId);    
                wallets.findOne({ ownerID: userWalletId }).exec((err, walletUser) => {
                var existingLoad = walletUser.balance;
                var myquery = { referenceNumber: slug }
                var status = req.body.status;
                console.log("test " + existingLoad - user.amount)
                var balance = (existingLoad - user.amount);
                var requestId = "Arp" + moment().format("x");
                var transactionDate = moment().format("x");
                var dateCreated = moment().format("x");
                var newStatus = {status, transactionDate}
                var myqueryUserWallet = { ownerID: userWalletId }
                var updatedBy = 'admin'; 
                var updateWallet = {dateCreated, updatedBy, balance, requestId}
                RequestWallets.updateOne(myquery, newStatus).exec((err, tag) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'cant update transaction wallet'
                        });
                    }
                    
                    
                    wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'cant update user wallet'
                            });
                        }
        
                    });
        
                    
                    res.json("Message: Successfully withdraw " + " previous ammount :" + existingLoad + " current ammount :" +  balance);
                });
        
        });

        } else {
            var userWalletId = (user.walletId);    
            wallets.findOne({ ownerID: userWalletId }).exec((err, walletUser) => {
                var existingLoad = walletUser.balance;
                var myquery = { referenceNumber: slug }
                var status = req.body.status;
                var balance = (user.amount + existingLoad);
                var requestId = "Arp" + moment().format("x");
                var transactionDate = moment().format("x");
                var dateCreated = moment().format("x");
                var newStatus = {status, transactionDate}
                var myqueryUserWallet = { ownerID: userWalletId }
                var updatedBy = 'admin'; 
                var updateWallet = {dateCreated, updatedBy, balance, requestId}
                RequestWallets.updateOne(myquery, newStatus).exec((err, tag) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'cant update transaction wallet'
                        });
                    }
                    
                    
                    wallets.updateOne(myqueryUserWallet, updateWallet).exec((err, tag) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'cant update user wallet'
                            });
                        }
        
                    });
        
                    
                    res.json("Message: Successfully updated status to " + status + " previous ammount :" + existingLoad + " previous ammount :" +  balance);
                });
        
        });
        }

        
});
};