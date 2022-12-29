import { useState, useEffect } from 'react';
import Search from '../components/Search';
import StockSelector from '../components/StockSelector';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import TypeMenu from '../components/TypeMenu';
import BuySell from '../components/BuySell';

const Assets = () => {
    const [currentUser, setCurrentUser] = useState({});
    const [currentStock, setCurrentStock] = useState({});
    const [stockList, setStockList] = useState([]);
    const [mode, setMode] = useState('');

    const today = new Date();
    today.setHours(0,0,0,0);

    const [range, setRange] = useState(['1m', new Date().setDate(today.getDate() - 31)]);
    const [dataSelect, setDataSelect] = useState({Open: true, Close: true, High: false, Low: false, Price: false});
    const [notificationText, setNotificationText] = useState('');
    const [notificationIsNegative, setNotificationIsNegative] = useState(false);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        getUser();

    }, []);

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
    return (
        <div className='mainPage'>
            <Search />
            <TypeMenu />
            <h1>Your Money - $10,482.06</h1>
            <StockSelector stockList={stockList} currentStock={currentStock} setStock={setCurrentStock}/>
            <Graph currentStock={currentStock} range={range} dataSelect={dataSelect} />
            <div className='row'>
                <BuySell setRefresh={setRefresh} setNotificationText={setNotificationText} setNotificationIsNegative={setNotificationIsNegative} mode={mode} setMode={setMode} currentStock={currentStock} currentUser={currentUser} />
                <StockInfo stock={currentStock ? currentStock : {}}/>
            </div>
        </div>
    );
}

export default Assets;