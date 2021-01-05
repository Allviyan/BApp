
const mongoose = require('mongoose');

const op_scheduled_bookingsSchema = new mongoose.Schema(
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
            trim: true,
            maxlength: 32,
            default: 'pending'
        },
        operator_id: {
            type: String,
            default: ''
        },
        vehicle_id: {
            type: String,
            default: ''
        },
        corp_client_id: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('op_scheduled_bookings', op_scheduled_bookingsSchema);