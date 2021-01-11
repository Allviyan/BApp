const mongoose = require('mongoose');

const walletsSchema = new mongoose.Schema(
    {
        
        OwnerID: {
            type: String,

            max: 32
        },
        Balance: {
            type: Number,
            required: true
        },
        Status: {
            type: Boolean,
            default: 0
        },
        Owner:{
            type:String
        }       
        
    },
    { timestamp: true }
);

module.exports = mongoose.model('wallet-bet', walletsSchema);
