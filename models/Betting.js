const mongoose = require('mongoose');

const bettingSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            default: 0
            
        },
       side: {
            type: String,
            required: true
        },
        ownerID: {
            type: String,
            required: true,
            max: 32
        },
        fightID: {
            type: String,
            required: true,
            max: 32
        },
        eventID: {
            type: String,
            required: true,
            max: 32
        },
        status: {
            type: Boolean,
            default: 0
        },
       dateCreated:{
            type:Date
        },
        dateUpdated:{
            type:Date
        },
        dateDeleted:{
            type:Date
        }       
        
    },
    { timestamp: true }
);

module.exports = mongoose.model('Betting', bettingSchema);
