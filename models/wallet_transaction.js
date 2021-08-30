const mongoose = require('mongoose');
const crypto = require('crypto');
const { stubFalse } = require('lodash');
const { StringDecoder } = require('string_decoder');

const walletTransactionSchema = new mongoose.Schema(
    {
        
        referenceNumber: {
            type: String,
            max: 50
        },
        type: {
            type: String,
            max:10
        },
        
        walletId:{
            type:String
        },      
        amount: {
            type: Number
        },
        owner:{
            type:String
        },
        status: {
            type: String,
            default: 'Pending'
        },
        transactionDate:{
            type:Date
        },
        reason:{
            type:String
        }    
           
        
    },
    { timestamp: true }
);

module.exports = mongoose.model('wallet-transaction-bet', walletTransactionSchema);
