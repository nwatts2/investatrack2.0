import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CollectionsGraph from '../components/CollectionsGraph';
import '../css/Recommended.css';

const RecommendedEntry = ({ stock }) => {
    return (
        <Link to={`/stocks/${stock.name}`}>
        <div className='recommendedEntry'>
            <div className='recommendedEntryColLeft'>
                <h2>{stock.name}</h2>
                <h3>{stock.longName}</h3>
            </div>
            <div className='recommendedEntryColMiddle'>
                <CollectionsGraph currentStock={stock} />
            </div>
            <div className='recommendedEntryColRight'>
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

const Recommended = ({ currentUser }) => {
    const [stockList, setStockList] = useState([]);

    useEffect(() => {
        async function getRecommended () {
            const stockResponse = await fetch(`/user/recommended/${currentUser._id}`);

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
            getRecommended();
        }

    }, [JSON.stringify(currentUser)]);

    return (
        <div className='recommended'>
            <div className='recommendedTitle'>
                <h2>Stocks For You</h2>
                <span>Some stocks you might like</span>
            </div>
            {stockList.length > 0 ? stockList.map((stock) => {
                return (<RecommendedEntry stock={stock} />);
            }) : ''}
        </div>
    );
}

export default Recommended;