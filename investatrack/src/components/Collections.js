import { useEffect, useState } from 'react';
import '../css/Collections.css';

const StockBox = ({ stock }) => {
    const [currentStock, setCurrentStock] = useState({});

    useEffect(() => {
        async function getStock() {
            const stockResponse = await fetch(`/record/id/${stock.stockID}`);

            if (!stockResponse.ok) {
                const message = `An error occured: ${stockResponse.statusText}`;
                window.alert(message);
                return;
            }

            const stockJSON = await stockResponse.json();

            if (JSON.stringify(currentStock) !== JSON.stringify(stockJSON)) {
                setCurrentStock(stockJSON);
            }
        }

        if (stock.stockID) {
            //window.alert(stock.stockID.toString());
            getStock();
        }

    }, [stock]);

    return (
        <div className={currentStock && currentStock.change ? (currentStock.change > 0 ? 'stockBox positiveStock' : 'stockBox negativeStock') : 'stockBox'}>
            <div className='stockBoxColumn1'>
                <h3>{currentStock ? currentStock.name : ''}</h3>
                <span>{currentStock && currentStock.longName ? currentStock.longName : ''}</span>
            </div>
            <div className='stockBoxColumn2'>
                <span>Graph</span>
            </div>
            <div className='stockBoxColumn3'>
                <h4>{currentStock && currentStock.change ? (currentStock.change > 0 ? "+" + currentStock.change.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    }) : currentStock.change.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    })) : ''}</h4>
                <h3>{currentStock && currentStock.price ? currentStock.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    }) : 'Unknown'}</h3>
            </div>
        </div>
    );
};

const Collections = ({ currentUser }) => {
    return (
        <div className='collections'>
            <h2>Collections</h2>
            {currentUser.stocks &&
                currentUser.stocks.map((stock) => {
                    return (
                        <div className='stockTable'>
                            <hr />
                            <StockBox stock={stock} />
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Collections;

/*
63890ae0f55e7d65a1cb0f9d
63890eb5f55e7d65a1d5485d
638911fcf55e7d65a1ddf64e
63890c63f55e7d65a1cf2eb0
6389101ef55e7d65a1d92115
*/