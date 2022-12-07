import { useEffect, useState } from 'react';
import Search from '../components/Search';
import Collections from '../components/Collections';
import StockSelector from '../components/StockSelector';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import News from '../components/News';

const Home = () => {
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
            <div className='row'>
                <Collections currentUser={currentUser}/>
                <div className='homeMain'>
                    <h1>Your Money - {currentUser.sMoney ? currentUser.sMoney.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    }) : '$0.00'}</h1>
                    <hr />
                    <StockSelector stockList={stockList} setStock={setCurrentStock}/>
                    <Graph currentStock={currentStock}/>
                    <StockInfo stock={currentStock ? currentStock : {}}/>
                </div>
            </div>
            <h2>Finance News</h2>
            <News />
        </div>
       
    );
}

export default Home;