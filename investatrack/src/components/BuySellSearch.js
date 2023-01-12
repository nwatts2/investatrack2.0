import { useEffect, useRef, useState } from 'react';
import '../css/BuySellSearch.css';

const BuySellSearchResult = ({ stock, setStock, mode }) => {
    return (
        <div className='buySellSearchResult' onClick={() => {if (mode==='BUY') {setStock(stock)}}}>
                <h2>{stock.name}</h2>
                <h3>{stock.longName}</h3>
        </div>
    );
};

const BuySellSearch = ({ stock, setStock, mode }) => {
    const [query, setQuery] = useState('');
    const [stockList, setStockList] = useState([]);
    const [focused, setFocused] = useState(false);
    const [timer, setTimer] = useState(setTimeout(() => {}, 500));
    const searchBox = useRef(null);

    let listCount = 0;

    useEffect(() => {
        async function getStock(name) {
            const stockResponse = await fetch(`/record/nameList/${name}`);

            if (!stockResponse.ok) {
                const message = `An error occured: ${stockResponse.statusText}`;
                window.alert(message);
                return;
            }

            const stockListJSON = await stockResponse.json();

            if (JSON.stringify(stockListJSON) !== JSON.stringify(stockList)) {
                setStockList(stockListJSON);
            }

        }

        listCount = 0;
        getStock(query.toUpperCase());
        

    }, [query]);

    function updateQuery() {
        if (searchBox && searchBox.current && searchBox.current.value !== query) {
            clearTimeout(timer);
            setTimer(setTimeout(() => {
                setQuery(searchBox.current.value);

            }, 500));
        }
    }

    return (
        <div className='buySellSearchBox'>
            <input type='search' onChange={updateQuery} onFocus={() => {setFocused(true)}} onBlur={() => {setTimeout(() => {setFocused(false)}, 100)}} disabled={mode==='BUY' ? false : true} ref={searchBox} placeholder="Search stocks"/>
            {(query.length !== 0 && focused) &&
            <div className='buySellSearchResultsBox'>
                {stockList.map((stock) => {
                    if (listCount < 10) {
                        listCount++;
                        if (listCount === 1) {
                            return (
                                <div className='buySellSearchResultWrapper'>
                                    <BuySellSearchResult stock={stock} setStock={setStock} mode={mode} />
                                </div>
                            );
                        } else {
                            return (
                                <div className='buySellSearchResultWrapper'>
                                    <hr />
                                    <BuySellSearchResult stock={stock} setStock={setStock} mode={mode} />
                                </div>
                            );
                        }
                        
                    } else {
                        return;
                    }
                    
                })}
            </div>
            }
        </div>
    );
};

export default BuySellSearch;