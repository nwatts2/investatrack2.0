const express = require('express');

const router = express.Router();

const dbo = require('../conn');

const ObjectId = require('mongodb').ObjectId;

router.route("/record").get(async function (req, res) {
    let db = await dbo.getDB();

    db.collection('stocks').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.route('/record/id/:id').get(async function (req, res) {
    let db = await dbo.getDB();
    let newQuery = {_id: ObjectId(req.params.id)};

    db.collection('stocks').findOne(newQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.route('/record/nameList/:name').get(async function (req, res) {
    let db = await dbo.getDB();
    const regex = new RegExp('^' + req.params.name, 'i');
    let newQuery = {name: regex};

    db.collection('stocks').find(newQuery).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.route('/record/name/:name').get(async function (req, res) {
    let db = await dbo.getDB();
    let newQuery = {name: req.params.name};

    db.collection('stocks').findOne(newQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.route('/record/trending').get(async function (req, res) {
    let db = await dbo.getDB();
    let newQuery = {name: 'trending'};

    db.collection('utilities').findOne(newQuery, function (err, result) {
        let stockQuery = {name: {'$in': result.symbols}};

        db.collection('stocks').find(stockQuery).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
    });

    });
});

router.route('/record/recommended/:id').get(async function (req, res) {
    let db = await dbo.getDB();
    let newQuery = {_id: ObjectId(req.params.id)};

    db.collection('users').findOne(newQuery, function (err, result) {
        const symbols = [];
        for (let stock of result.recommended) {
            symbols.push(stock.symbol);
        }

        let stockQuery = {name: {'$in': symbols}};

        db.collection('stocks').find(stockQuery).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
    });

    });
});

router.route('/user').get(async function (req, res) {
    let db = await dbo.getDB();
    let newQuery = {email: 'coulten.davis23@gmail.com'};

    db.collection('users').findOne(newQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.route('/user/exchange').post(async (req, res) => {
    const userID = req.body.user;
    const stockName = req.body.stockName;
    const stockID = req.body.stockID;
    const quantity = Number(req.body.quantity);
    const mode = req.body.mode;

    let db = await dbo.getDB();
    let userQuery = {_id: ObjectId(userID)};
    let stockQuery = {_id: ObjectId(stockID)};

    let userResult, stockResult;

    try {
        userResult = await db.collection('users').findOne(userQuery);
        stockResult = await db.collection('stocks').findOne(stockQuery);

    } catch (error) {
        res.json({status: 'fail', statusCode: error});

    } finally {
        if (userResult && stockResult) {
            const stockArray = [];
            const totalPrice = stockResult.price * quantity;
        
            for (let stock of userResult.stocks) {
                stockArray.push(stock);
            }
        
            let needsUpdate = false;
        
            for (let stock of stockArray) {
                if (stock.name === stockName) {
                    if (mode === 'BUY') {
                        needsUpdate = true
                        stock.quantity = Number(stock.quantity) + Number(quantity);
                        stock.pPrice = stockResult.price;
                        stock.pTotal += totalPrice;

                    } else if (mode === 'SELL') {
                        if (Number(stock.quantity) >= Number(quantity)) {
                            needsUpdate = true
                            stock.quantity = Number(stock.quantity) - Number(quantity);
                            stock.pPrice = stockResult.price;
                            stock.pTotal += -1 * totalPrice;
                        }
                    }
                    
                }
            }
        
            if (!needsUpdate && mode === 'BUY') {stockArray.push({
                stockID: ObjectId(stockID),
                quantity: quantity,
                pPrice: stockResult.price,
                pTotal: totalPrice,
                name: stockName
            })}
        
            let newValues;
            
            if (mode === 'BUY') {
                newValues = {$set: {
                    stocks: stockArray,
                    cMoney: userResult.cMoney - totalPrice
                }};
            } else if (mode === 'SELL' && needsUpdate) {
                newValues = {$set: {
                    stocks: stockArray,
                    cMoney: userResult.cMoney + totalPrice
                }};
            }
    
            try {
                if ((mode === 'BUY' && userResult.cMoney >= totalPrice) || (mode === 'SELL' && needsUpdate)) {
                    db.collection('users').updateOne(userQuery, newValues).then((response) => {
                        res.json({status: 'success'})
                    });
                } else {
                    res.json({status: 'insufficient funds'});
                }
    
            } catch (error) {
                res.json({status: 'fail', statusCode: error});
    
            }
        }
    }
});    
    
    
router.route("/getNews").get(async function (req, res) {
    let db = await dbo.getDB();
    let newQuery = {name: "latest-news"};

    db.collection('utilities').findOne(newQuery, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
    
});

module.exports = router;