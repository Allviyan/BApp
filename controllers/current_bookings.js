const Tag = require('../models/current_bookings');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const assert = require('assert');
exports.createCustBooking = (req, res) => {
    const { booking_date, trip_number, pickup_location, destination,longlitude, latitude ,arrival_time, delivery_receipt_number, rate, status, customer_id  } = req.body;
   
    let timestamp = new Date().getTime();
    let tag = new Tag({booking_date, trip_number, pickup_location, longlitude, latitude ,destination ,arrival_time, delivery_receipt_number, rate, status, timestamp, customer_id});

    tag.save((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data); // dont do this res.json({ tag: data });
    });
};

exports.listCustBooking = (req, res) => {
    Tag.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.getOneCustBooking = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOne({ _id: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'no booking found'
            });
        }
        res.json(tag);
    });
};

exports.getCustBookingHistory = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.find({ customer_id: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'no booking history'
            });
        }
        res.json(tag);
    });
};


exports.getCustBookingHistoryTotal = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.aggregate([
        { $match: { } },
        { $group: { _id: "$customer_id", total: { $sum: "$rate" } } }
     ])
    // Tag.distinct("customer_id")
    .exec((err, tag) => {
         console.log("sdasda", err)
         console.log("dasdadsa",tag)
        if (err) {
            return res.status(400).json({
                error: 'no booking history'
            });
        }
        res.json(tag);
    });
};

exports.updateCustBooking = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    var myquery ={ _id: slug } 
    var newV = req.body;
    Tag.updateOne(myquery,newV).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'Booking not found'
            });
        }
        res.json(tag);
    });
};

exports.remove = (req, res) => {
    let slug = req.params.slug;
    Tag.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'vehicle deleted successfully'
        });
    });
};
