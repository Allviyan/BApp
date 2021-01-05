
const mongoose = require('mongoose');

const vehiclesSchema = new mongoose.Schema(
    {
        type_of_vehicle: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        plate_number: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        slug: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        vehicle_make: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        vehicle_year: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        operator_id: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        created_at: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('vehicles', vehiclesSchema);