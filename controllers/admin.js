const User = require('../models/admin');
const UserManagement = require('../models/user');
const wallets = require('../models/wallet')
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const RequestWallets = require('../models/wallet_transaction')
const gameList = require('../models/gameList')
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

    UserManagement.findOne({ userId: slug }).exec((err, players) => {
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
    var myquery = { userId: slug }
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
//     wallets.find({}).exec((err, allUser) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'inventory not found'
//             });
//         }
//         res.json({
//             "identifier": "get all user list", allUser
//         });
// });
    const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const Status = req.query.status;
    if (Status) {
        wallets.count({}).exec((err, total) => {
            wallets.find({ $or: [{ status: { $regex: Status, $options: 'i' } }]})
                    .skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'Customer not found'
                            });
                        }
                        res.json({
                            "identifier": "get all user walletds", tag,
                            pagination: tag.length, page, page, total
                        });
                    });
            });
        } else{
    wallets.count({}).exec((err, total) => {
    wallets.find({})
                .skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Customer not found'
                        });
                    }
                    res.json({
                        "identifier": "get all user wallets", tag,
                        pagination: tag.length, page, page, total
                    });
                });
        });
    }  
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

exports.getWalletsRequest = (req, res) => {
//     RequestWallets.find({}).exec((err, allUser) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'inventory not found'
//             });
//         }
//         res.json({
//             "identifier": "get all user wallet request", allUser
//         });
// });
const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;
const page = req.query.page ? parseInt(req.query.page) : 1;
const Status = req.query.status;
if (Status) {
RequestWallets.count({}).exec((err, total) => {
RequestWallets.find({ $or: [{ status: { $regex: Status, $options: 'i' } }]})
            .skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Customer not found'
                    });
                }
                res.json({
                    "identifier": "get all user wallets", tag,
                    pagination: tag.length, page, page, total
                });
            });
    });
} else{
    RequestWallets.count({}).exec((err, total) => {
        RequestWallets.find({})
                    .skip((page - 1) * pagination).limit(pagination).exec((err, tag) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'Customer not found'
                            });
                        }
                        res.json({
                            "identifier": "get all user wallets", tag,
                            pagination: tag.length, page, page, total
                        });
                    });
            });
}
};

exports.getOneWalletRequest = (req, res) => {

    const slug = req.params.slug;
    RequestWallets.findOne({referenceNumber: slug }).exec((err, allUser) => {
        if (_.isEmpty(allUser)) {
            return res.status(400).json({
                err: 'transaction not found'
            });
        }

        if (err) {
            return res.status(400).json({
                error: 'inventory not found'
            });
        }
        res.json({
            "identifier": "get all user wallet request", allUser
        });
});
};

exports.addGameList = (req, res) => {

    const { englishGameName, chineseGameName, gameSymbolApi, gameCategory, gameAvatar} = req.body;
    let glist = new gameList({englishGameName, chineseGameName, gameSymbolApi, gameCategory, gameAvatar});


    glist.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err.errmsg
            });
        }

        res.json({"identifier": "Added game data ", data}); // dont do this res.json({ tag: data });
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

exports.getGameCategory = (req, res) => {
    const slug = req.params.slug;
    gameList.find({ gameCategory: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'product not found'
            });
        }
    });
};


exports.updateGame = (req, res) => {
    const slug = req.params.slug;
    var myquery = { gameSymbolApi: slug }
    var newV = req.body;
    gameList.updateOne(myquery, newV).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'cant update user'
            });
        }
        res.json("Message: Successfully updated" + slug);
    });
};



exports.updateGameById = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    var myquery = { _id: slug }
    var newV = req.body;
    gameList.updateOne(myquery, newV).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'cant update user'
            });
        }
        res.json("Message: Successfully updated" + slug);
    });
};