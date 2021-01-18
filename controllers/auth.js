const User = require('../models/user');
const wallets = require('../models/wallet')
const RequestWallets = require('../models/wallet_transaction')
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    // console.log(req.body);
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                err: 'Email is taken'
            });
        }

        var active = 0;
        const { Firstname, Lastname, MobileNumber, email, password  } = req.body;
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let DateCreated = new Date();
        console.log(DateCreated)
        let newUser = new User({ Firstname, Lastname,MobileNumber, email, password, profile, username, active, DateCreated});
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            // res.json({
            //     user: success
            // });

            User.findOne().limit(1).sort({$natural:-1}).exec((err, user) => {
                let OwnerID = user._id;
                let Owner = user.Firstname + " " + user.Lastname
                let Balance 
                let Status 

                let newWallet = new wallets({ OwnerID, Balance, Status, Owner, DateCreated});
                console.log(OwnerID, Owner)
                newWallet.save((err, success) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    });
                }
                });
            });

            res.json({
                message: 'Signup success! Please signin.'
            });
        });
    });
};

exports.signin = (req, res) => {
    const { MobileNumber, password } = req.body;
    // check if user exist
    User.findOne({ MobileNumber }).exec((err, user) => {
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
        const { _id, username, name, email, role } = user;
        return res.json({
            token,
            user: { _id, username, name, email, role }
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

    console.log(req)
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

exports.getUserProfile = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    console.log(slug)
    User.findOne({ _id: slug }).exec((err, allUser) => {
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

