const Tag = require('../models/corp_client_request');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const { vehicle_request_number, vehicle_requirements, products_to_be_delivered, company_name,company_id ,mobile_number } = req.body;
   
    let timestamp = new Date().getTime();
    let tag = new Tag({vehicle_request_number, vehicle_requirements, products_to_be_delivered, company_name,company_id ,mobile_number, timestamp});

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

exports.list = (req, res) => {
    Tag.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOne({ slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'vehicle not found'
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
