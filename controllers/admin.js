const User = require('../models/admin');
const UserManagement = require('../models/user');
const wallets = require('../models/wallet')
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const RequestWallets = require('../models/wallet_transaction')
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

        const { firstName, lastName, address, email,mobileNumber,username,password  } = req.body;
       
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let Createdat = new Date().getTime();
        let newUser = new User({ firstName, lastName, address, email,mobileNumber,profile,username,password });
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
    // check if user exist
    User.findOne({ username }).exec((err, user) => {
        console.log("dasda", user)
        if (err || !user) {
            return res.status(400).json({
                error: 'Username does not exist. Please signup.'
            });
        }

        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { expiresIn: '1d' });
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

        // if (user.role !== 1) {
        //     return res.status(400).json({
        //         error: 'Admin resource. Access denied'
        //     });
        // }

        req.profile = user;
        next();
    });
};

exports.getAllUser = (req, res) => {
    UserManagement.find({}).exec((err, allUser) => {
        if (err) {
            return res.status(400).json({
                error: 'inventory not found'
            });
        }
        res.json({
            "identifier": "get all user list", allUser
        });
});
};

exports.getOnePlayer = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    UserManagement.findOne({ _id: slug }).exec((err, players) => {
        if (err) {
            return res.status(400).json({
                error: 'USER not found'
            });
        }
        res.json(players);
    });
};

exports.updateUser = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    var myquery = { _id: slug }
    var newV = req.body;
    UserManagement.updateOne(myquery, newV).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'cant update user'
            });
        }
        res.json("Message: Successfully updated" + slug);
    });
};


// exports.wallets = (req, res) => {
//     let DateCreated = new Date().getTime();
//     let timestamp = new Date().getTime();
//     const { OwnerID, Balance, Status, Owner} = req.body;
//     let completeId = new wallets({ OwnerID, Balance, Status, Owner });


//     completeId.save((err, data) => {
//         if (err) {
//             return res.status(400).json({
//                 error: err.errmsg
//             });
//         }

//         res.json('Success : Added one'); // dont do this res.json({ tag: data });
//     });
// };

exports.getWallets = (req, res) => {
    wallets.find({}).exec((err, allUser) => {
        if (err) {
            return res.status(400).json({
                error: 'inventory not found'
            });
        }
        res.json({
            "identifier": "get all user list", allUser
        });
});
};

exports.getOneWallet = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    console.log(slug)
    wallets.findOne({ _id: slug }).exec((err, allUser) => {
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

exports.getOneUserWallet = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    wallets.findOne({ ownerID: slug }).exec((err, allUser) => {
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

exports.updatePlayerWalletRequest = (req, res) => {
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