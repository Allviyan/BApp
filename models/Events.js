const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema(
    {   
        EventDate:{
            type:Date
        },
        Title: {
            type: String,
            required: true
        },
        OwnerID: {
            type: String,
            required: true,
            max: 32
        },
        Description: {
            type: String,
            required: true,
            max: 128
        },
        MinBet: {
            type: Number,
            default: 0
        },
        MaxBet: {
            type: Number,
            default: 0
        },
        NoOfFight: {
            type: Number,
            required: true
        },
        VideoSource: {
            type: String,
            required: true,
            max: 32
        },
        Status: {
            type: Boolean,
            default: 0
        },
        CreatedDate:{
            type:Date
        },
        CompletedDate:{
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

module.exports = mongoose.model('Events', eventsSchema);
