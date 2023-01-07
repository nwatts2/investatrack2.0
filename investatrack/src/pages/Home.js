import { useEffect, useState } from 'react';
import Search from '../components/Search';
import Collections from '../components/Collections';
import StockSelector from '../components/StockSelector';
import RangeSelector from '../components/RangeSelector';
import DataSelector from '../components/DataSelector';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import News from '../components/News';
import Notification from '../components/Notification';

const Home = () => {
    const [currentUser, setCurrentUser] = useState({});
    const [currentStock, setCurrentStock] = useState({});
    const [stockList, setStockList] = useState([]);
    const [notificationText, setNotificationText] = useState('');
    const [notificationIsNegative, setNotificationIsNegative] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const today = new Date();
    today.setHours(0,0,0,0);

    const [range, setRange] = useState(['1m', new Date().setDate(today.getDate() - 31)]);
    const [dataSelect, setDataSelect] = useState({Open: true, Close: true, High: false, Low: false, Price: false});

    useEffect(() => {
        getUser();

    }, [refresh]);

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
            <div className='row'>
                <Collections currentUser={currentUser} setNotificationText={setNotificationText} setNotificationIsNegative={setNotificationIsNegative} setRefresh={setRefresh} />
                <div className='homeMain'>
                    <div className='title'>
                        <h2 style={{textDecoration: 'underline'}}>{currentUser && currentUser.name ? currentUser.name + "'s" : 'Your'} Portfolio </h2> 
                        <h1>{currentUser.cMoney ? currentUser.cMoney.toLocaleString('en-US', {
                            style: 'currency',
                            currency:'USD'
                        }) : '$0.00'}</h1>
                    </div>
                    <StockSelector stockList={stockList} currentStock={currentStock} setStock={setCurrentStock}/>
                    <div className='graphTitleRow'>
                        <RangeSelector range={range} setRange={setRange} />
                        <h2>-{currentStock && currentStock.fname ? currentStock.fname : ''}-</h2>
                        <DataSelector range={range} dataSelect={dataSelect} setDataSelect={setDataSelect} />
                    </div>
                    
                    <Graph currentStock={currentStock} range={range} dataSelect={dataSelect} />
                    <StockInfo stock={currentStock ? currentStock : {}}/>
                </div>
            </div>
            <News />
            <Notification text={notificationText} isNegative={notificationIsNegative} />
        </div>
       
    );
}

export default Home;