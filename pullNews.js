const fetch = require('node-fetch');
const dbo = require('./conn');

module.exports = {
    getNews: async function () {
        let db = await dbo.getDB();
        let newQuery = {name: 'latest-news'};

        let info;
        
        const country = 'us', category='business', pageSize='10';
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API}`
    
        /*const newsResponse = await fetch(url);

        if (newsResponse.ok) {
            console.log('News Pulled Successfully');
            info = await newsResponse.json();
        } else {
            console.log('Failed to Pull News');
            return {};
        }

        if (info) {
            let newValues = {$set: {info: info}};

            db.collection('news').updateOne(newQuery, newValues, {upsert: true}, function (err, res) {
                if (err) throw err;
                console.log('News Updated');
            });
        }*/
    }
}