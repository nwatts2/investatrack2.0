import { useState, useEffect } from 'react';
import Search from '../components/Search';
import StockSelector from '../components/StockSelector';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import StockBreakdown from '../components/StockBreakdown';
import BuySell from '../components/BuySell';
import UserInfo from '../components/UserInfo';
import RangeSelector from '../components/RangeSelector';
import DataSelector from '../components/DataSelector';
import ModeSelector from '../components/ModeSelector';
import Recommended from '../components/Recommended';
import ManageLists from '../components/ManageLists';
import Notification from '../components/Notification';


const Assets = () => {
    const [currentUser, setCurrentUser] = useState({});
    const [currentStock, setCurrentStock] = useState({});
    const [stockList, setStockList] = useState([]);
    const [mode, setMode] = useState('');
    const [graphMode, setGraphMode] = useState('PERFORMANCE');

    const today = new Date();
    today.setHours(0,0,0,0);

    const tempRange = new Date();
    tempRange.setHours(0,0,0,0);

    const [range, setRange] = useState(['1m', tempRange.setDate(today.getDate() - 31)]);
    const [dataSelect, setDataSelect] = useState({Open: true, Close: true, High: false, Low: false, Price: false});
    const [notificationText, setNotificationText] = useState('');
    const [notificationIsNegative, setNotificationIsNegative] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [stockTotals, setStockTotals] = useState({});

    useEffect(() => {
        getUser();

    }, [refresh]);

    useEffect(() => {
        if (currentUser && currentUser.stocks) {
            updateStockTotals();

        }
    }, [range]);

    useEffect(() => {
        if (currentUser) {
            getStockList().then(() => {
                if (stockList[0]) {
                    setCurrentStock(stockList[0]);
                }
            });
        }

    }, [JSON.stringify(currentUser)]);

    useEffect(() => {
        if (stockList[0]) {
            setCurrentStock(stockList[0]);
            updateStockTotals();
        }

    }, [JSON.stringify(stockList)]);

    async function getUser() {
        const userResponse = await fetch('/user/');

        if (!userResponse.ok) {
            const message = `An error occured: ${userResponse.statusText}`;
            window.alert(message);
            return;
        }

        const userJSON = await userResponse.json();

        if (JSON.stringify(currentUser) !== JSON.stringify(userJSON)) {
            setCurrentUser(userJSON);
        }
    }

    async function getStockList() {
        const tempStockList = [];

        if (currentUser.stocks) {
            for (let stock of currentUser.stocks) {
                const stockResponse = await fetch(`/record/id/${stock.stockID}`);

                if (!stockResponse.ok) {
                    const message = `An error occured: ${stockResponse.statusText}`;
                    window.alert(message);
                    return;
                }

                const stockJSON = await stockResponse.json();
                tempStockList.push(stockJSON);
            }
    
            if (JSON.stringify(tempStockList) !== JSON.stringify(stockList) && tempStockList.length > 0) {
                setStockList(tempStockList);
    
            }
        }
    }

    function updateStockTotals () {
        let tempHistory = [], history=[], value = 0, change = 0, changePercent = 0;

        for (let userStock of currentUser.stocks) {
            for (let stock of stockList) {
                if (userStock.name === stock.name) {
                    if (stock.price && userStock.quantity) {
                        value += (userStock.quantity * stock.price);
                    }

                    for (let day of stock.history) {
                        let index = tempHistory.findIndex((e) => e.date === day.date);
                        let newEntry;

                        let dateIndex = currentUser.history.findIndex((e) => e.date === day.date);
                        let ownedQuantity = 0;

                        for (let closestDate of currentUser.history) {
                            if (closestDate.date <= day.date) {
                                let transactionIndex = closestDate.transactions.findIndex((e) => e.name === stock.name);

                                if (transactionIndex !== -1) {
                                    ownedQuantity = closestDate.transactions[transactionIndex].newQuantity;
                                }
                            }
                        }

                        if (index === -1) {
                            newEntry = {
                                date: day.date,
                                open: day.open * ownedQuantity,
                                close: day.close * ownedQuantity,
                                high: day.high * ownedQuantity,
                                low: day.low * ownedQuantity,
                                activeStocks: [stock.name]
                            };
                        } else {
                            newEntry = tempHistory[index];
                            newEntry.open += day.open * ownedQuantity;
                            newEntry.close += day.close * ownedQuantity;
                            newEntry.high += day.high * ownedQuantity;
                            newEntry.low += day.low * ownedQuantity;
                            newEntry.activeStocks.push(stock.name);
                        }

                        tempHistory.push(newEntry);
                    }

                    break;
                }
            }
        }

        for (let entry of tempHistory) {
            if (entry.activeStocks.length === stockList.length) {
                history.push(entry);
            }
        }

        const nextDay = new Date(range[1]).setDate(new Date(range[1]).getDate() + 1);

        for (let entry of history) {
            const date = new Date(entry.date);

            if (date.getTime() >= range[1] && date.getTime() < nextDay) {
                change = value - entry.open;
                changePercent = change / entry.open * 100;
            }
        }

        let tempTotals = {
            value: value,
            change: change,
            percent: changePercent,
            history: history
        }

        if (JSON.stringify(tempTotals) !== JSON.stringify(stockTotals)) {
            setStockTotals(tempTotals);
        }

    }

    return (
        <div className='mainPage'>
            <Search />
            <UserInfo currentUser={currentUser} stockTotals={stockTotals} range={range} />
            <ModeSelector mode={graphMode} setMode={setGraphMode} />
            <div className='row'>
                <div className='assetGraph'>
                    <StockSelector stockList={stockList} currentStock={currentStock} setStock={setCurrentStock}/>
                    <div className='graphTitleRow'>
                        <RangeSelector range={range} setRange={setRange} />
                        <h2>-{currentStock && currentStock.fname ? currentStock.fname : ''}-</h2>
                        <DataSelector range={range} dataSelect={dataSelect} setDataSelect={setDataSelect} />
                    </div>
                    
                    <Graph currentStock={currentStock} range={range} dataSelect={dataSelect} />
                </div>
                <StockBreakdown currentStock={currentStock} currentUser={currentUser} />
            </div>
            <StockInfo stock={currentStock ? currentStock : {}}/>
            <ManageLists currentUser={currentUser} setNotificationIsNegative={setNotificationIsNegative} setNotificationText={setNotificationText} setRefresh={setRefresh} />
            <div className='row'>
                <Recommended currentUser={currentUser} />
                <BuySell setRefresh={setRefresh} setNotificationText={setNotificationText} setNotificationIsNegative={setNotificationIsNegative} mode={mode} setMode={setMode} currentStock={currentStock} currentUser={currentUser} />
            </div>
            <Notification text={notificationText} isNegative={notificationIsNegative} />
        </div>
    );
}

export default Assets;