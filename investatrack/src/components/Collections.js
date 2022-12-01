import { useEffect, useState } from 'react';
import '../css/Collections.css';

const StockBox = ({ stock }) => {
    const [currentStock, setCurrentStock] = useState({});

    useEffect(() => {
        async function getStock() {
            const stockResponse = await fetch(`/record/${stock.stockID}`);

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
        <div className='stockBox'>
            <div className='stockBoxColumn1'>
                <h3>{currentStock ? currentStock.name : ''}</h3>
                <span>Placeholder Inc.</span>
            </div>
            <div className='stockBoxColumn2'>
                <span>Graph</span>
            </div>
            <div className='stockBoxColumn3'>
                <h4>Net Change</h4>
                <h3>{currentStock.price ? currentStock.price.toLocaleString('en-US', {
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