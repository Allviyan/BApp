const User = require('../models/admin');
const UserManagement = require('../models/user');
const wallets = require('../models/wallet')
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


exports.signup = (req, res) => {
    // console.log(req.body);
    User.findOne({ username: req.body.username }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Username is taken'
            });
        }

        const { Firstname, Lastname,Businessname,address, email,MobileNumber,username,password  } = req.body;
       
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let Createdat = new Date().getTime();
        let newUser = new User({ Firstname, Lastname,Businessname,address, email,MobileNumber, password, profile, username, Createdat });
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
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match.'
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


exports.wallets = (req, res) => {
    let DateCreated = new Date().getTime();
    let timestamp = new Date().getTime();
    const { OwnerID, Balance, Status, Owner} = req.body;
    let completeId = new wallets({ OwnerID, Balance, Status, Owner });


    completeId.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err.errmsg
            });
        }

        res.json('Success : Added one'); // dont do this res.json({ tag: data });
    });
};

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
    console.log(slug)
    wallets.findOne({ OwnerID: slug }).exec((err, allUser) => {
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

exports.updateOneWallet = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    var myquery = { _id: slug }
    var newV = req.body;
    wallets.updateOne(myquery, newV).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'cant update user'
            });
        }
        res.json("Message: Successfully updated" + slug);
    });
};