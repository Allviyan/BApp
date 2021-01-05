const Tag = require('../models/vehicles');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const { type_of_vehicle, vehicle_make, vehicle_year, operator_id, plate_number  } = req.body;
    let slug = slugify(plate_number);
    console.log(slug);
    let created_at = new Date().getTime();
    let tag = new Tag({type_of_vehicle, slug, vehicle_make, vehicle_year, operator_id, created_at, plate_number});

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

exports.listVehicle = (req, res) => {
    Tag.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.readVehicle = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOne({ _id: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'vehicle not found'
            });
        }
        res.json(tag);
    });
};


exports.readVehicleOperator = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOne({ operator_id: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'Operator not found'
            });
        }
        res.json(tag);
    });
};

exports.readAllVehicleOperator = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.find({ operator_id: slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'Operator not found'
            });
        }
        res.json(tag);
    });
};

exports.remove = (req, res) => {
    let slug = req.params.slug;
    Tag.findOneAndRemove({ _id: slug }).exec((err, data) => {
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
