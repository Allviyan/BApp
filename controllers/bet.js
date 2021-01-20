const Betting = require('../models/Betting');
const BettingResultIncome = require('../models/PlayerBettingResultAndIncome')
const RequestWallets = require('../models/wallet_transaction')



exports.addBet = (req, res) => {
    let DateCreated = new Date();
    const { Amount, Side, OwnerID, Frequency, FightID, EventID, Status, DateCreated } = req.body;
    let bet = new Betting({Amount, Side, OwnerID, Frequency, FightID, EventID, Status, DateCreated});


    bet.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err.errmsg
            });
        }

        res.json(data); // dont do this res.json({ tag: data });
    });
};


exports.getAllBet = (req, res) => {
   
        Betting.find({ }).exec((err, tag) => {
            if (_.isEmpty(tag)) {
                return res.status(400).json({
                    error: 'lookup not found'
                });
            }
            res.json({ "identifier": "GetAll-BET", tag});
        });

};

exports.getOneUserBet = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Betting.findOne({ _id: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'product not found'
            });
        }
    });
};



exports.addBetResultWinnings = (req, res) => {
    let DateCreated = new Date();
    const { Income, Result, BettingID } = req.body;
    let bet = new BettingResultIncome({Income, Result, BettingID, DateCreated});


    bet.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: err.errmsg
            });
        }

        res.json(data); // dont do this res.json({ tag: data });
    });
};