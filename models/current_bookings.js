
const mongoose = require('mongoose');

const current_bookingsSchema = new mongoose.Schema(
    {
        booking_date: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        trip_number: {
            type: String,
            trim: true,
            required: true,
            unique:true,
            maxlength: 32
        },
        pickup_location: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        destination: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        longlitude: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        latitude: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        arrival_time: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        delivery_receipt_number: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        rate: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        status: {
            type: String,
            default: 'Pending'
        },
        operator_id: {
            type: String,
            default: ''
        },
        vehicle_id: {
            type: String,
            default: ''
        },
        customer_id: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('current_bookings', current_bookingsSchema);