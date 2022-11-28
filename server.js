if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const record = require('./routes/record');
const cors = require('cors');
const dbo = require('./conn.js');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(record);
app.use(express.static(path.join(__dirname, 'investatrack', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'investatrack', 'build', 'index.html'));
})

app.listen(process.env.PORT || 3001, () => {
    dbo.connectDB();
})