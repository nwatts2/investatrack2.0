const yahooFinance = require('yahoo-finance2').default;

const history = async (query) => {
    let result;

    try{
        result = await yahooFinance._chart(query, {period1: '2022-09-22T16:15:00.000Z', period2: '2022-09-22T18:15:00.000Z', interval: '1m'});
    }
    catch{
        console.log('Error');
    }
    finally{
        return result.quotes;
    }
}

module.exports = history;