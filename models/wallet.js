const mongoose = require('mongoose');

const walletsSchema = new mongoose.Schema(
    {
        
        ownerID: {
            type: String,
            required: true,
            max: 32
        },
        balance: {
            type: Number,
            default: 0
        },
        balance: {
            type: Number,
            default: 0
        },
        balance: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: 'Active'
        },
        owner:{
            type:String
        },
        dateCreated:{
            type:Date
        },
        updatedBy:{
            type:String
        },
        requestId: {
            type: String
        }
    },
    { timestamp: true }
);

module.exports = mongoose.model('wallet-bet', walletsSchema);
