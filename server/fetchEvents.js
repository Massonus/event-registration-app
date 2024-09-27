const fetch = require('node-fetch');
const Event = require('./models/event');
const db = require('./database');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const apikey = process.env.API_KEY;

const fetchAndSaveEvents = async () => {
    try {
        const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events?apikey=${apikey}`);
        const data = await response.json();

        const { _embedded: { events = [] } = {} } = data;

        const savePromises = events.map(async (event) => {
            const { name: title, info: description, dates, promoter = {} } = event;

            const newEvent = new Event({
                title: title || 'No title',
                description: description || 'No description',
                eventDate: dates?.start?.dateTime || new Date(),
                organizer: promoter?.name || 'Unknown Organizer',
                participants: [],
            });

            await newEvent.save();
            console.log(`Saved event: ${title}`);
        });

        await Promise.all(savePromises);
    } catch (error) {
        console.error('Error fetching or saving events', error);
    }
};

const runScript = async () => {
    await db.connect();

    console.log('Fetching and saving events on first run...');
    await fetchAndSaveEvents();

    setInterval(async () => {
        console.log('Fetching and saving events again...');
        await fetchAndSaveEvents();
    }, 1800000);
};

module.exports = runScript;
