const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// bring routes
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const authOperator = require('./routes/authOperator')
const operatorVehicle = require('./routes/vehicles')
const operatorScheduled = require('./routes/op_scheduled_bookings')
const corporateClient = require('./routes/corp_client')
const corporateRequest = require('./routes/corp_client_request')
const adminRequest = require('./routes/admin')
const currentBooking = require('./routes/current_bookings')
// app
const app = express();

//db

mongoose
.connect(process.env.DATABASE, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
.then(() => console.log('Succefully Login!'));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
// cors

if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// routes
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', authOperator);
app.use('/api', operatorVehicle);
app.use('/api', operatorScheduled);
app.use('/api', corporateClient);
app.use('/api', corporateRequest);
app.use('/api', adminRequest);
app.use('/api', currentBooking);
// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
