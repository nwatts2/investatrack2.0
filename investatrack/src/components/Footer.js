import { useEffect, useState } from 'react';
import '../css/Footer.css';

const Footer = () => {
    const [stockList, setStockList] = useState([]);

    useEffect(() => {
        async function getTrending () {
            const symbols = [], tempStockList = [];

            const stockResponse = await fetch(`/record/trending`);

            if (!stockResponse.ok) {
                const message = `An error occured: ${stockResponse.statusText}`;
                window.alert(message);
                return;
            }

            const stockJSON = await stockResponse.json();        

            for (let symbol of stockJSON.symbols) {
                symbols.push(symbol);
            }

            for (let symbol of symbols) {
                const stockResponse = await fetch(`/record/name/${symbol}`);

                if (!stockResponse.ok) {
                    const message = `An error occured: ${stockResponse.statusText}`;
                    window.alert(message);
                    return;
                }

                const stockJSON = await stockResponse.json();
                if (tempStockList.length < 20 && stockJSON != null) {
                    tempStockList.push(stockJSON);
                }
            }

            if (JSON.stringify(tempStockList) !== JSON.stringify(stockList) && tempStockList.length > 0) {
                setStockList(tempStockList);

            }
        }
        
        getTrending();

    }, []);

    return (
        <div className='footer'>
            <div className='trendingCycle'>
                {stockList.map((stock) => {
                    if (stock && stock.name && stock.price) {
                        return (
                            <div className='trendingEntry'>
                                <span>{stock.name} - ${stock.price}</span>
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