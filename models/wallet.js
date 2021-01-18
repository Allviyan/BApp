const mongoose = require('mongoose');

const walletsSchema = new mongoose.Schema(
    {
        
        OwnerID: {
            type: String,
            required: true,
            max: 32
        },
        Balance: {
            type: Number,
            default: 0
            
        },
        Status: {
            type: Boolean,
            default: 0
        },
        Owner:{
            type:String
        },
        DateCreated:{
            type:Date
        }       
        
    },
    { timestamp: true }
);

module.exports = mongoose.model('wallet-bet', walletsSchema);
