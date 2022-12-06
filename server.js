if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const record = require('./routes/record');
const cors = require('cors');
const dbo = require('./conn');
const path = require('path');
const pullNews = require('./pullNews');
const stocks = require('./stocks');

app.use(cors());
app.use(express.json());
app.use(record);
app.use(express.static(path.join(__dirname, 'investatrack', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'investatrack', 'build', 'index.html'));
});

app.listen(process.env.PORT || 3001, () => {
    dbo.connectDB();

    setTimeout(async () => {
        //stocks.main();
        stocks.getTrending();

        pullNews.getNews();

        setInterval(() => {
            pullNews.getNews();
        }, 1800000);

    }, 3500);

    //clearTimeout(timeout);
});