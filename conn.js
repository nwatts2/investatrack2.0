const {MongoClient} = require('mongodb');
let db;

module.exports = {
    connectDB: function () {
        MongoClient.connect(process.env.DATABASE_URL)
            .then(function (result) {
                db = result.db('investa');
                console.log('Connected to Database');
            })
            .catch(function (error) {
                console.error(error);
                throw error;
            });
    },
    getDB: function () {
        return db;
    }
};