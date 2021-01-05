
const mongoose = require('mongoose');

const corp_client_requestSchema = new mongoose.Schema(
    {
        vehicle_request_number: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        vehicle_requirements: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        products_to_be_delivered: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        company_id: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        company_name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        mobile_number: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        timestamp: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('corp_client_request', corp_client_requestSchema);