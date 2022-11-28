const express = require('express');

const recordRoutes = express.Router();

const dbo = require('../conn');

const ObjectId = require('mongodb').ObjectId;

recordRoutes.route("/record").get(function (req, res) {
    let db = dbo.getDB();

    db.collection('candidates').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

recordRoutes.route('/record/:id').get(function (req, res) {
    let db = dbo.getDB();
    let newQuery = {_id: ObjectId(req.params.id)};

    db.collection('candidates').findOne({newQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
    }});
});

module.exports = recordRoutes;