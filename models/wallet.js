const mongoose = require('mongoose');
const crypto = require('crypto');
const { stubFalse } = require('lodash');
const { StringDecoder } = require('string_decoder');

const walletsSchema = new mongoose.Schema(
    {
        
        OwnerID: {
            type: String,

            max: 32
        },
        Balance: {
            type: Double,
            required: true
        },
        Status: {
            type: Double,
            default: 0
        },
        Owner:{
            type:String
        }       
        
    },
    { timestamp: true }
);

module.exports = mongoose.model('wallet-bet', walletsSchema);
