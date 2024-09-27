const mongoose = require('mongoose');

const connect = () => {
    // mongoose.connect('mongodb://mongo:27017/events')
    mongoose.connect('mongodb://localhost:27017/events')
        .then(() => console.log('Database connected'))
        .catch(err => console.log(err));
};

module.exports = { connect };
