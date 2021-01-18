const mongoose = require('mongoose');

const bettingSchema = new mongoose.Schema(
    {
        Amount: {
            type: Number,
            default: 0
            
        },
        Side: {
            type: String,
            required: true
        },
        OwnerID: {
            type: String,
            required: true,
            max: 32
        },
        FightID: {
            type: String,
            required: true,
            max: 32
        },
        EventID: {
            type: String,
            required: true,
            max: 32
        },
        Status: {
            type: Boolean,
            default: 0
        },
        DateCreated:{
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

module.exports = mongoose.model('Betting', bettingSchema);
