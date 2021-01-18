const mongoose = require('mongoose');

const fightsSchema = new mongoose.Schema(
    {   

        FightNumber: {
            type: Number,
            required: true
        },

        FightResult: {
            type: String,
            max: 32
        },
        EventID: {
            type: String,
            required: true,
            max: 128
        },
        Status: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: 0
        },
        CreatedDate:{
            type:Date
        },
        DateUpdated:{
            type:Date
        },
        DateDeleted:{
            type:Date
        }       
        
    },
    { timestamp: true }
);

module.exports = mongoose.model('Fights', fightsSchema);
