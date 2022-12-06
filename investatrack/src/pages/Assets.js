import { useState, useEffect } from 'react';
import Search from '../components/Search';
import StockSelector from '../components/StockSelector';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import TypeMenu from '../components/TypeMenu';
import Sell from '../components/Sell';

const Assets = () => {
    const [currentUser, setCurrentUser] = useState({});
    const [currentStock, setCurrentStock] = useState({});
    const [stockList, setStockList] = useState([]);

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
            <StockSelector stockList={stockList} setStock={setCurrentStock}/>
            <Graph />
            <div className='row'>
                <Sell />
                <StockInfo stock={currentStock}/>
            </div>
        </div>
    );
}

export default Assets;