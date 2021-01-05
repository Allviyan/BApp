const vehicle = require('../models/vehicles');
const User = require('../models/operators');
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

        const { Firstname, Lastname,Businessname,address, email,MobileNumber,username,password,vehicle_id  } = req.body;
       
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let Createdat = new Date().getTime();
        let newUser = new User({ Firstname, Lastname,Businessname,address, email, MobileNumber, password, profile, username, vehicle_id, Createdat });
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


exports.registerOperator = (req, res) => {
    // console.log(req.body);
    User.findOne({ username: req.body.username }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Username is taken'
            });
        }

        const { Firstname, Lastname,Businessname,address, email,MobileNumber,username,password,approve  } = req.body;
       
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let Createdat = new Date().getTime();
        let newUser = new User({ Firstname, Lastname,Businessname,address, email,MobileNumber, password, profile, username,approve, Createdat });
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
        const { _id, username, Firstname,Lastname, email, role,vehicle_id, address } = user;
        vehicle.findOne({ _id:vehicle_id  }).exec((err, vehicle) => {
            if (err) {
                return res.status(400).json({
                    error: 'No associated vehicle!, Please Contact your Karga Admin'
                });
            }
        const { plate_number } = vehicle;
        console.log("dasdasda",vehicle)
       

        return res.json({
            token,
            user: { _id, username, Firstname, Lastname, email, role, address },
            vehicle: {plate_number}
        });
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

        if (user.approve == 'true') {
            return res.status(400).json({
                error: 'Admin resource. Access denied'
            });
        }

        req.profile = user;
        next();
    });
};


exports.operatorList = (req, res) => {
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

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    

    User.findOne({ _id: slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.updateOperatorStatus = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    var myquery ={ _id: slug }
    var newV = {approved: 1}

    User.updateOne(myquery,newV).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data.nModified + " Activated Operator");
    });
};

exports.deactivateOperatorStatus = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    var myquery ={ _id: slug }
    var newV = {approved: 0}

    User.updateOne(myquery,newV).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data.nModified + " Activated Operator");
    });
};

exports.updateOperatorDetails = (req, res) => {
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