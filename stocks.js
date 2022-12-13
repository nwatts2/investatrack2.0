const yahooFinance = require('yahoo-finance2').default;
const dbo = require('./conn');

const ObjectId = require('mongodb').ObjectId;

var blacklist = [];

const queryStocks = async () => {
    let db = await dbo.getDB();
    let newQuery = {name: 'SymbolList'};

    const symbolObj = await db.collection('utilities').findOne(newQuery);

    if (symbolObj) {
        return symbolObj.symbols;
    } else {
        return [];
    }
}

const history = async (query, startDate, endDate, interval) => {
    let chartResult, summaryResult;

    try{
        chartResult = await yahooFinance._chart(query, {period1: startDate, period2: endDate, interval: interval});
        summaryResult = await yahooFinance.quoteSummary(query, {modules: ['price']});
        updateDB(chartResult, summaryResult);

    }
    catch{
        console.log('Error');
        if (!blacklist.includes(query)) {blacklist.push(query);}
    }
    finally{
        return [chartResult, summaryResult];
    }
}

const getTrending = async () => {
    const queryOptions = {count: 100, lang: 'en-US'};
    const result = await yahooFinance.trendingSymbols('US', queryOptions);
    const symbols = [];

    if (result && result.quotes) {
        result.quotes.forEach((quote) => {
            symbols.push(quote.symbol);
        })
    }

    let db = await dbo.getDB();
    let newQuery = {name: 'trending'};

    let newValues = {$set: 
        {
            symbols: symbols
        }};

    db.collection('utilities').updateOne(newQuery, newValues, {upsert: true}, function (err, res) {
        if (err) throw err;
    });
}

const getRecommended = async () => {    
    let db = await dbo.getDB();
    db.collection('users').find().toArray(async function (err, result) {
        for (let user of result) {
            const stocks = [];

            if (user.stocks) {
                for (let stock of user.stocks) {
                    if (stock.name) {
                        stocks.push(stock.name)
                    }
                }
            }

            const result = await yahooFinance.recommendationsBySymbol(stocks);

            const recommended = [];

            if (result) {
                for (let response of result) {
                    for (let symbol of response.recommendedSymbols) {
                        if (!stocks.includes(symbol.symbol)) {
                            recommended.push(symbol);
                        }
                    }
                }
            }

            let i = 0;
            const length = recommended.length;

            while (i < length) {
                let j = 0;
                while (j < length) {
                    if (recommended[i].score < recommended[j].score && i < j) {
                        const tempObj = recommended[i];
                        recommended[i] = recommended[j];
                        recommended[j] = tempObj;
                    }

                    j++;
                }
                i++;
            }

            const finalList = [];
            for (let stock of recommended) {
                let found = false;

                for (let symbol of finalList) {
                    if (stock.symbol === symbol.symbol) {found = true;}
                }

                if (!found) {finalList.push(stock)}
            }

            db.collection('users').updateOne({_id: user._id}, {$set: {recommended: finalList}}, function (err, result) {
                if (err) throw err;
            });

        }
    });
}

const updateDB = async function (chartResult, summaryResult) {
    let db = await dbo.getDB();
    let newQuery = {name: chartResult.meta.symbol};

    let newValues = {$set: 
        {
            longName: summaryResult.price.longName, 
            currency: chartResult.meta.currency, 
            history: chartResult.quotes,
            change: summaryResult.price.regularMarketChange,
            changePercent: summaryResult.price.regularMarketChangePercent,
            price: summaryResult.price.regularMarketPrice,
            dayHigh: summaryResult.price.regularMarketDayHigh,
            dayLow: summaryResult.price.regularMarketDayLow,
            volume: summaryResult.price.regularMarketVolume
        }};

    db.collection('stocks').updateOne(newQuery, newValues, {upsert: true}, function (err, res) {
        if (err) throw err;
        console.log(`${summaryResult.price.longName} (${chartResult.meta.symbol}) Info Updated`);
    });
}

const getBlacklist = async function () {
    let db = await dbo.getDB();
    let newQuery = {name: 'blacklist'};

    const blacklistObj = await db.collection('utilities').findOne(newQuery);

    if (blacklistObj.blacklist.length > 0) {
        console.log(`Blacklist Retrieved`);
        blacklist = blacklistObj.blacklist;

        return blacklist;
    }

    console.log(`Failed to Retrieve Blacklist`);

    return [];
    
}

const updateBlacklist = async function () {
    let db = await dbo.getDB();
    let newQuery = {name: 'blacklist'};

    let newValues = {$set: 
        {
            blacklist: blacklist
        }};

    db.collection('utilities').updateOne(newQuery, newValues, {upsert: true}, function (err, res) {
        if (err) throw err;
        console.log(`Blacklist Updated`);
    });
}

const main = async function () {
    const today = new Date();
    today.setHours(0,0,0,0);

    const endDate = today.toISOString();

    today.setFullYear(today.getFullYear() - 2);

    const startDate = today.toISOString(), interval = '1d';

    const start = Date.now();

    const symbols = await queryStocks();
    const whitelistSymbols = [];

    const blacklist = await getBlacklist();

    //console.log(blacklist.length);

    for (let symbol of symbols) {
        if (!blacklist.includes(symbol)) {
            whitelistSymbols.push(symbol);
        }        
    }

    //console.log(whitelistSymbols.length);

    for (let symbol of whitelistSymbols) {
        const temp = await history(symbol, startDate, endDate, interval);
    }

    const end = Date.now();

    console.log(`Execution time for stock updates: ${(end - start) / 1000} seconds`);

    updateBlacklist();
}

module.exports = {main: main, getTrending: getTrending, getRecommended: getRecommended};