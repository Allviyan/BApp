const User = require('../models/user');
const wallets = require('../models/wallet')
const RequestWallets = require('../models/wallet_transaction')
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
var request = require("request");
var md5s = require("md5");
var moment = require("moment");
const _ = require('lodash');
const e = require('express');
const { all } = require('../routes/auth');

exports.signup = (req, res) => {
    // console.log(req.body);
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                err: 'Email is taken'
            });
        }

        var active = 0;
        const { firstName, lastName, mobileNumber, email,userName, password,photo  } = req.body;
        let username = shortId.generate();
        var date = new Date;
        var userId = String(date.getTime()).substring( 4 );;
  
       console.log("dasda : " + userId)
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let DateCreated = new Date();
        console.log(DateCreated)
        let newUser = new User({ userId, firstName, lastName, mobileNumber, email, password, profile, username,photo, userName, active, DateCreated});
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            console.log("dasdasdas " + err)
            // res.json({
            //     user: success
            // });

            User.findOne().limit(1).sort({$natural:-1}).exec((err, user) => {
                let ownerID = user.userId;
                let owner = user.firstName + " " + user.lastName
                let balance 
                let status 

                let newWallet = new wallets({ ownerID, balance, status, owner, DateCreated});
                console.log(ownerID, owner)
                newWallet.save((err, success) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    });
                }
        

            var API_URL = 'https://api.prerelease-env.biz/IntegrationService/v3/http/CasinoGameAPI' + '/player/account/create/';
            var secureLogin = "eexim_euroexim";
            var secretKeyHash = "testKey";
            var resdsds = 'testKey';
            var secretKey = 'PragmaticPlay';
            var externalPlayerId= ownerID;
            
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
            
            // request.post(opts, function(err, result) {
            //   if (err) {
            //     console.log("Pragmatic@addUser - error on post ", err);
            //   }
            //   console.log(result);
              
            
            // });

            request.post(opts, function(error, response, body){
               console.log(body);
            
               return res.json({
                message: 'Signup success! Please signin.',
                userId : ownerID,
                onwenerName : owner,
                ppid: body.playerId
            });

         
    });
});   


});
        });
    });
};

exports.signin = (req, res) => {
    const { userName, mobileNumber, password } = req.body;
    if(userName){
        User.findOne({ userName }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User with that mobile does not exist. Please signup.'
                });
            }
            // authenticate
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    error: 'mobile number and password do not match.'
                });
            }
            // generate a token and send to client
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
            res.cookie('token', token, { expiresIn: '1w' });
            const { _id, userName, balance,  name, email, userId, photo } = user;
            return res.json({
                token,
                user: { _id, userName, balance,  name, email, userId,photo }
            });
        });
    } else {

    User.findOne({ mobileNumber }).exec((err, user) => {

        console.log("dasda", user)
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that mobile does not exist. Please signup.'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'mobile number and password do not match.'
            });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { expiresIn: '1d' });
        const { _id, username, name, email, userId, photo } = user;
        wallets.findOne({ ownerID : userId}).exec((err, userWallet) => {
        const { balance } = userWallet;
     
        return res.json({
            token,
            user: { _id, username, balance,  name, email, userId,photo }
        });
    });
    
    });
}
};

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};

exports.requireSigninUser = expressJwt({
    secret: process.env.JWT_SECRET
});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findById({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id;
    User.findById({ _id: adminUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role == true) {
            return res.status(400).json({
                error: 'User not activated by admin, you can contact our admin'
            });
        }

        req.profile = user;
        next();
    });
};


exports.userList = (req,res) => {
    //const operatorId = req.user._id;
    User.find({})
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);

    });
}


exports.readUser = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    console.log(slug)

    User.findOne({ _id: slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.updateUser = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    var myquery ={ _id: slug }
    
 
    var newV = req.body;

    User.updateOne(myquery,newV).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data.nModified + " Activated Operator");
    });
};

exports.wallets = (req, res) => {

    const { playerID, amount, transType } = req.body;
    User.findOne({ userId: playerID }).exec((err, user) => {
        
        if (_.isEmpty(user)) {
            return res.status(400).json({
                err: 'User not found'
            });
        }

        if(transType =='Withdraw') {
        wallets.findOne({ ownerID: playerID }).exec((err, walletUser) => {   
        if( amount > walletUser.balance){
            return res.status(400).json({
                err: 'transaction cannot continue because amount requested is higher than existing balance'
            });
        }

           
      var transactionPrefix = "Uwr";
      var type = transType;
      var referenceNumber = transactionPrefix + moment().format("x");
      var transactionDate  = moment().format("x");
      var owner = user.firstName + " " + user.lastName
       var walletId = playerID;

    //var referenceTransactionId = 'Uwr' + String(date.getTime()).substring( 4 );
    
    let completeId = new RequestWallets({ referenceNumber, type, walletId, amount, owner, transactionDate });


    completeId.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err.errmsg
            });
        }
        console.log(err)

        res.json('Success : Added user reqest wallets, please wait for the finance team to verify your request!'); // dont do this res.json({ tag: data });
    });
});
        } else {
      var transactionPrefix = "Uwr";
      var type = transType;
      var referenceNumber = transactionPrefix + moment().format("x");
      var transactionDate  = moment().format("x");
      var owner = user.firstName + " " + user.lastName
       var walletId = playerID;

    //var referenceTransactionId = 'Uwr' + String(date.getTime()).substring( 4 );
    
    let completeId = new RequestWallets({ referenceNumber, type, walletId, amount, owner, transactionDate });


    completeId.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err.errmsg
            });
        }
        console.log(err)

        res.json('Success : Added user reqest wallets, please wait for the finance team to verify your request!'); // dont do this res.json({ tag: data });
    });
}  
});

};

exports.getOneUserWalletRequest = (req, res) => {
    
    const slug = req.params.slug.toLowerCase();
    RequestWallets.find({ walletId: slug }).exec((err, allUser) => {
        if (_.isEmpty(allUser)) {
            return res.status(400).json({
                err: 'theres no wallet transfer request!'
            });
        }

        if (err) {
            return res.status(400).json({
                error: 'inventory not found'
            });
        }
        res.json({
            "identifier": "get One user walle request status", allUser
        });
});
};


exports.updateUserRequestWallet = (req, res) => {
    
    const slug = req.params.slug;

    RequestWallets.findOne({ referenceNumber: slug }).exec((err, user) => {
        if (_.isEmpty(user)) {
            return res.status(400).json({
                err: 'transaction not found'
            });
        }

        if(user.status =='Granted!'){
            return res.status(400).json({
                err: 'transaction cannot be updated , because it has been granted!'
            });
        }
        
    var myquery = { referenceNumber: slug }
    var status = req.body.status;
    var transactionDate = moment().format("x");
    var newStatus = {status, transactionDate} 
    RequestWallets.updateOne(myquery, newStatus).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'cant update user'
            });
        }
        res.json("Message: Successfully updated status to " + status);
    });
});
};


exports.getOneUserWallet = (req, res) => {
    
    const slug = req.params.slug.toLowerCase();
    console.log(slug)
    wallets.find({ ownerID: slug }).exec((err, allUser) => {
        if (err) {
            return res.status(400).json({
                error: 'inventory not found'
            });
        }
        res.json({
            "identifier": "get One user wallet", allUser
        });
});
};

exports.getUserProfile = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    User.findOne({ userId: slug }).exec((err, allUser) => {
        console.log(allUser)
        if (err) {  
            return res.status(400).json({
                error: 'inventory not found'
            });
        }

        let userId = allUser.userId;
        let firstName = allUser.firstName;
        let lastName = allUser.lastName;
        let mobileNumber = allUser.mobileNumber;
        let email = allUser.email;

        res.json({
            "identifier": "get One user profile", userId, firstName, lastName, mobileNumber, email 
        });
});
};


exports.updateUserProfile = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    var myquery ={ userId: slug }
    
 
    var newV = req.body;

    User.updateOne(myquery,newV).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data.nModified + " Updated User");
    });
};



exports.getAllGameList = (req, res) => {
   
    const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const category = req.query.catergory;
    if (category) {
        gameList.count({}).exec((err, total) => {
            gameList.find({ $or: [{ gameCategory: { $regex: category, $options: 'i' } }]})
                    .skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'games not found'
                            });
                        }
                        res.json({
                            "identifier": "get all games", tag,
                            pagination: tag.length, page, page, total
                        });
                    });
            });
        } else{
            gameList.count({}).exec((err, total) => {
                gameList.find({})
                .skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'games not found'
                        });
                    }
                    res.json({
                        "identifier": "get all games", tag,
                        pagination: tag.length, page, page, total
                    });
                });
        });
    }  

};

exports.getOneGame = (req, res) => {
    const slug = req.params.slug;
    gameList.findOne({ gameSymbolApi: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'product not found'
            });
        }
        res.json({
            "identifier": "get one game", tag
        });
    });
};