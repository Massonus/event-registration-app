const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    name: String,
    email: String,
    birthDate: Date,
    heardFrom: String,
});

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    eventDate: Date,
    organizer: String,
    participants: [participantSchema],
});

module.exports = mongoose.model('Event', eventSchema);
