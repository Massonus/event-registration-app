const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes');
const db = require('./database');
const fetchEvents = require('./fetchEvents');

app.use(express.json());

app.use(express.static(path.join(__dirname, '../client')));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

db.connect();

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');

    fetchEvents()
        .then(() => {
            console.log('Initial fetch and save completed, now running every 4 hours');
        })
        .catch(err => {
            console.error('Script encountered an error', err);
        });
});
