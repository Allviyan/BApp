const mongoose = require('mongoose');

const gameListSchema = new mongoose.Schema(
    {   
        englishGameName:{
            type:String
        },
        chineseGameName: {
            type: String
        },
        gameSymbolApi: {
            type: String
        },
        gameCategory: {
            type: String
        },
        gameAvatar: {
            type: String
        }
    },
    { timestamp: true }
);

module.exports = mongoose.model('gameList', gameListSchema);
