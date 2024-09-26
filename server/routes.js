const express = require('express');
const router = express.Router();
const Event = require('./models/event');

router.get('/events', async (req, res) => {
    const {sortBy, order} = req.query;
    const sortOptions = {};

    if (sortBy && order) {
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    }

    try {
        const events = await Event.find().sort(sortOptions);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Error fetching events');
    }
});


router.post('/events', async (req, res) => {
    const {title, description, eventDate, organizer} = req.body;
    const newEvent = new Event({title, description, eventDate, organizer, participants: []});
    await newEvent.save();
    res.json(newEvent);
});

router.post('/register', async (req, res) => {
    const {eventId, name, email, birthDate, heardFrom} = req.body;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send('Event not found');
        }

        event.participants.push({name, email, birthDate, heardFrom});
        await event.save();

        res.status(200).send('Registered successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error registering participant');
    }
});


router.get('/participants/:eventId', async (req, res) => {
    try {
        const searchQuery = req.query.search?.toLowerCase() || '';
        const event = await Event.findById(req.params.eventId).select('title participants');
        if (!event) return res.status(404).send('Event not found');

        const filteredParticipants = event.participants.filter(participant =>
            participant.name.toLowerCase().includes(searchQuery) ||
            participant.email.toLowerCase().includes(searchQuery)
        );

        const participants = filteredParticipants.map(participant => ({
            name: participant.name,
            email: participant.email,
            birthDate: participant.birthDate,
            heardFrom: participant.heardFrom,
            eventTitle: event.title
        }));

        res.json(participants);
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).send('Error fetching participants');
    }
});


module.exports = router;
