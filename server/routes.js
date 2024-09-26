const express = require('express');
const router = express.Router();
const Event = require('./models/event');

router.get('/events', async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

router.post('/events', async (req, res) => {
    const {title, description, eventDate, organizer} = req.body;
    const newEvent = new Event({title, description, eventDate, organizer, participants: []});
    await newEvent.save();
    res.json(newEvent);
});

router.post('/register', async (req, res) => {
    const {eventId, name, email, birthDate, heardFrom} = req.body;
    const event = await Event.findById(eventId);
    event.participants.push({name, email, birthDate, heardFrom});
    await event.save();
    res.status(200).send('Registered successfully');
});

router.get('/participants/:eventId', async (req, res) => {
    const event = await Event.findById(req.params.eventId);
    res.json(event.participants);
});

module.exports = router;
