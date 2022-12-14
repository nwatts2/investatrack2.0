import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CollectionsGraph from '../components/CollectionsGraph';
import '../css/Collections.css';

const StockBox = ({ currentStock }) => {
        return (
            <Link to={`/stocks/${currentStock.name}`} className='styledLink'>
            <div className={currentStock && currentStock.change ? (currentStock.change > 0 ? 'stockBox positiveStock' : 'stockBox negativeStock') : 'stockBox'}>
                <div className='stockBoxColumn1'>
                    <h3>{currentStock ? currentStock.name : ''}</h3>
                    <span>{currentStock && currentStock.longName ? currentStock.longName : ''}</span>
                </div>
                <div className='stockBoxColumn2'>
                    <CollectionsGraph currentStock={currentStock} />
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
            </Link>
        );
};

const Collections = ({ currentUser }) => {
    const [stockList, setStockList] = useState([]);

    useEffect(() => {
        async function getStocks () {
            const stockResponse = await fetch(`/user/stocks/${currentUser._id}`);

            if (!stockResponse.ok) {
                const message = `An error occured: ${stockResponse.statusText}`;
                window.alert(message);
                return;
            }

            const stockJSON = await stockResponse.json();        

            if (JSON.stringify(stockJSON) !== JSON.stringify(stockList)) {
                setStockList(stockJSON);
            }
        }
        
        if (currentUser._id) {
            getStocks();

        }

    }, [JSON.stringify(currentUser)]);

    return (
        <div className='collections'>
            <div className='collectionsTitle'>
                <h2>Collections</h2>
                <span>A quick view of your assets</span>
            </div>
            <div className='stockList'>
                {stockList.length > 0 &&
                    stockList.map((stock, index) => {
                        return (
                            <div className='stockTable'>
                                {index !== 0 &&
                                    <hr />
                                }
                                <StockBox currentStock={stock} />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Collections;