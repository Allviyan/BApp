const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        lastName: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        mobileNumber: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        referralNumber: {
            type: String,
            trim:true
        },
        profile: {
            type: String,
            required: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        about: {
            type: String
        },
        active: {
            type: Boolean,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        resetPasswordLink: {
            data: String,
            default: ''
        },
        DateCreated:{
            type:Date
        } 
    },
    { timestamp: true }
);

userSchema
    .virtual('password')
    .set(function(password) {
        // create a temporarity variable called _password
        this._password = password;
        // generate salt
        this.salt = this.makeSalt();
        // encryptPassword
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

module.exports = mongoose.model('User-bet', userSchema);
