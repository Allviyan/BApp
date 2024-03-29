const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// bring routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRequest = require('./routes/admin')
const providerRequest = require('./routes/provider')
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
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRequest);
app.use('/api', providerRequest);

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
