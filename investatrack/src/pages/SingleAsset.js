import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../components/Search';
import RangeSelector from '../components/RangeSelector';
import DataSelector from '../components/DataSelector';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import BuySell from '../components/BuySell';
import Notification from '../components/Notification';

const SingleAsset = () => {
    const [stock, setStock] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [mode, setMode] = useState('');
    const [notificationText, setNotificationText] = useState('');
    const [notificationIsNegative, setNotificationIsNegative] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const navigate = useNavigate();

    const today = new Date();
    today.setHours(0,0,0,0);

    const [range, setRange] = useState(['1m', new Date().setDate(today.getDate() - 31)]);
    const [dataSelect, setDataSelect] = useState({Open: true, Close: true, High: false, Low: false, Price: false, Cash: false});

    useEffect(() => {
        getStock();
        getUser();

    }, [navigate, refresh]);

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

    async function getStock() {
        const url = window.location.href;
        const urlArray = url.split('/');
        const name = urlArray[urlArray.length - 1];

        const stockResponse = await fetch(`/record/name/${name}`);

        if (!stockResponse.ok) {
            const message = `An error occured: ${stockResponse.statusText}`;
            window.alert(message);
            return;
        }

        const stockJSON = await stockResponse.json();

        if (JSON.stringify(stockJSON) !== JSON.stringify(stock)) {
            setStock(stockJSON);
        }
        
    }

    return (
        <div className='mainPage'>
            <Search />
            <div className='singleAssetTitle'>
                <h1>{stock.longName ? stock.longName : (stock.name ? stock.name : '')} - {stock.price ? stock.price.toLocaleString('en-US', {
                            style: 'currency',
                            currency:'USD'
                        }) : ''}</h1>
                {(stock.change && stock.change !== 0) &&
                    <h2 className={stock.change ? (stock.change > 0 ? 'positiveEntry' : 'negativeEntry') : ''}>({stock.change > 0 ? "+" + stock.change.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    }) : stock.change.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    })})</h2>
                }
            </div>
            <div className='row'>
                <div className='graphSection'>
                    <div className='graphTitleRow'>
                                <RangeSelector range={range} setRange={setRange} />
                                <h2>-{stock && stock.name ? stock.name : ''}-</h2>
                                <DataSelector graphMode='STOCKS' range={range} dataSelect={dataSelect} setDataSelect={setDataSelect} />
                            </div>
                    <div className='singleAssetGraph'>
                        <Graph currentStock={stock} range={range} dataSelect={dataSelect} />
                    </div>
                </div>
                <BuySell setRefresh={setRefresh} setNotificationText={setNotificationText} setNotificationIsNegative={setNotificationIsNegative} mode={mode} setMode={setMode} currentStock={stock} currentUser={currentUser} />
            </div>
            <StockInfo stock={stock}/>
            <Notification text={notificationText} isNegative={notificationIsNegative} />
        </div>
    );
}

export default SingleAsset;