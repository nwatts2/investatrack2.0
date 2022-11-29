const express = require('express');

const router = express.Router();

const dbo = require('../conn');

const ObjectId = require('mongodb').ObjectId;

router.route("/record").get(async function (req, res) {
    let db = await dbo.getDB();

    db.collection('congressionalCandidates').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.route('/record/:id').get(async function (req, res) {
    let db = await dbo.getDB();
    let newQuery = {_id: ObjectId(req.params.id)};

    db.collection('congressionalCandidates').findOne({newQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
    }});
});

router.route("/getNews").get(async function (req, res) {
    let db = await dbo.getDB();
    let newQuery = {name: "latest-news"};

    db.collection('news').findOne(newQuery, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
    
});

module.exports = router;