import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../components/Search';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import Sell from '../components/Sell';

const SingleAsset = () => {
    const [stock, setStock] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getStock();

    }, [navigate]);

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
            <h1>{stock.name ? stock.name : ''} - {stock.price ? stock.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    }) : ''}</h1>
            <Graph />
            <div className='row'>
                <Sell />
                <StockInfo stock={stock}/>
            </div>
        </div>
    );
}

export default SingleAsset;