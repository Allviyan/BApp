const mongoose = require('mongoose');

const playerBettingResultAndIncomeSchema = new mongoose.Schema(
    {   

        Income: {
            type: Number,
            required: true
        },

        Result: {
            type: String,
            required: true
        },
        BettingID: {
            type: String,
            required: true
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

module.exports = mongoose.model('playerBettingResultAndIncome', playerBettingResultAndIncomeSchema);
