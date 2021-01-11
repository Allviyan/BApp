const mongoose = require('mongoose');
const crypto = require('crypto');
const { stubFalse } = require('lodash');
const { StringDecoder } = require('string_decoder');

const walletTransactionSchema = new mongoose.Schema(
    {
        
        ReferenceNumber: {
            type: String,
            max: 32
        },
        Type: {
            type: String,
            max:10
        },
        
        WalletId:{
            type:String
        },      
        Amount: {
            type: Number
        },
        Owner:{
            type:String
        },
        Status: {
            type: Boolean,
            default: 0
        }     
        
    },
    { timestamp: true }
);

module.exports = mongoose.model('wallet-transaction-bet', walletTransactionSchema);
