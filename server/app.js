const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes');
const db = require('./database');

app.use(express.static(path.join(__dirname, '../client')));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

db.connect();

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
