import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Popular.css';

const PopularEntry = ( {stock} ) => {
    return (
        <Link className='popularLink' to={`/stocks/${stock.name}`}>
        <div className='popularEntry'>
            <div className='popularEntryColLeft'>
                <h2>{stock.name}</h2>
                <h3>{stock.longName}</h3>
            </div>
            <div className='popularEntryColRight'>
                <h3 className={stock.change ? (stock.change > 0 ? 'positiveEntry' : 'negativeEntry') : ''}>{stock.change ? (stock.change > 0 ? "+" + stock.change.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    }) : stock.change.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    })) : ''}</h3>
                <h2>{stock.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    })}</h2>
            </div>
        </div>
        </Link>
    );
}

const Popular = () => {
    const [stockList, setStockList] = useState([]);

    useEffect(() => {
        async function getTrending () {
            const stockResponse = await fetch(`/trending`);

            if (!stockResponse.ok) {
                const message = `An error occured: ${stockResponse.statusText}`;
                window.alert(message);
                return;
            }

            const stockJSON = await stockResponse.json();
            
            let i = 0;
            let length = stockJSON.length;

            while (i < length) {
                let j = 0;

                while(j < length) {
                    if (Math.abs(stockJSON[j].changePercent) > Math.abs(stockJSON[i].changePercent) && i < j) {
                        const tempObj = stockJSON[i];
                        stockJSON[i] = stockJSON[j];
                        stockJSON[j] = tempObj;
                    }

                    j++;
                }

                i++;
            }

            if (JSON.stringify(stockJSON) !== JSON.stringify(stockList)) {
                setStockList(stockJSON);
            }
        }
        
        getTrending();

    }, []);

    return (
        <div className='popular'>
            <div className='popularListTitle'>
                <h2>Most Popular</h2>
                <span>See the latest trending stocks</span>
            </div>
            <div className='popularList'>
                <div className='leftCol'>
                    {stockList.length > 0 ? stockList.map((stock, index) => {
                        if (index < 5) {
                            return <PopularEntry stock={stock} />
                        }
                    }) : ''}
                </div>
                <div className='rightCol'>
                    {stockList.map((stock, index) => {
                            if (index < 10 && index >= 5) {
                                return <PopularEntry stock={stock} />
                            }
                        })}
                </div>
            </div>
        </div>
    );
}

export default Popular;