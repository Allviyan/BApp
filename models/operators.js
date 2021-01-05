const mongoose = require('mongoose');
const crypto = require('crypto');

const operatorSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            unique: true,
            index: true,
            lowercase: true
        },
        Firstname: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        Lastname: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        Businessname: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        address: {
            type: String,
            trim: true,
            required: true,
            max: 100
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        MobileNumber: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        vehicle_id: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            default: ''
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
        approved: {
            type: Boolean,
            default: 0
        },
        credits:{
            type: Number,
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

        Createdat: {
            type: String,
            trim: true
        },
       
    },
    { timestamp: true }
);

operatorSchema
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

operatorSchema.methods = {
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

module.exports = mongoose.model('Operator', operatorSchema);


