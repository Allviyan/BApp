const mongoose = require('mongoose');

const fightResultAndCommissionSchema = new mongoose.Schema(
    {   

        Commission: {
            type: Number,
            required: true
        },

        FightID: {
            type: Number,
            required: true
        },
        EventID: {
            type: Number,
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

module.exports = mongoose.model('fightResultAndCommission', fightResultAndCommissionSchema);
