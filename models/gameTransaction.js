const mongoose = require('mongoose');

const gameTranscationSchema = new mongoose.Schema(
    {
        playerID: {
            type: String
        },
        extPlayerID: {
            type: String
        },
        gameID:{
            type:String
        },
        playSessionID:{
            type:String
        },
        timestamp:{
            type:String
        },
        referenceID: {
            type: String
        },
        type: {
            type: String
        },
        amount: {
            type: String
        },
        currency: {
            type: String
        }
        
    },
    { timestamp: true }
);

module.exports = mongoose.model('gameTransaction', gameTranscationSchema);
