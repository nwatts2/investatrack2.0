import { useEffect, useState } from 'react';
import '../css/Footer.css';

const Footer = () => {
    const [stockList, setStockList] = useState([]);

    let limit = 0;

    useEffect(() => {
        async function getTrending () {
            const stockResponse = await fetch(`/trending`);

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
        
        getTrending();

    }, []);

    return (
        <div className='footer'>
            <div className='trendingCycle' style={stockList.length === 0 ? {color: 'transparent', animation: 'none'} : {color: 'white', animation: 'scroll 60s linear infinite'}}>
                {stockList.map((stock) => {
                    if (stock && stock.name && stock.price && limit < 25) {
                        limit += 1;
                        return (
                            <div className='trendingEntry'>
                                <span>{stock.name} - {stock.price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span>
                                <span>&#9733;</span>
                            </div>
                        )
                    } else {
                        return;
                    }
                    
                })}
            </div>
        </div>
    );
}

export default Footer;