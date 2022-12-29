const dbo = require('./conn');

const ObjectId = require('mongodb').ObjectId;

async function updateUserHistory() {
    let db = await dbo.getDB();
    let userArray = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    try {
        userArray = await db.collection('users').find().toArray();
        stocks = await db.collection('stocks').find().toArray();

    } catch (error) {
        console.log(error);

    } finally {
        if (userArray.length > 0 && stocks.length > 0) {
            for (let user of userArray) {
                let historyArray = user.history || [];
                let index = historyArray.findIndex((thisEntry) => {return JSON.stringify(thisEntry.date) === JSON.stringify(today)});
                let history;

                let listsArray = user.lists || [];

                for (let list of listsArray) {
                    
                }

                if (index >= 0) {
                    history = historyArray[index];
                } else {
                    history = {};
                }

                history.date = today;
                history.cMoney = user.cMoney;
                history.cStockValue = 0;

                for (let stock of user.stocks) {
                    history.cStockValue += stocks[stocks.findIndex((thisStock) => {return thisStock.name === stock.name})].price * stock.quantity;
                }

                if (index < 0) {
                    historyArray.push(history);
                    console.log(`Updating history for user: ${user.email}`);

                } else {
                    console.log(`Overwriting history for user: ${user.email}`);

                }

                db.collection('users').updateOne({_id: user._id}, {$set: {history: historyArray}});
            }
        }
    }

    
}

async function main () {
    updateUserHistory();
}

module.exports = {main: main};