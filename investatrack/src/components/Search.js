import { useEffect, useRef, useState } from 'react';
import '../css/Search.css';

const SearchResult = ({ stock }) => {
    return (
        <div className='searchResult'>
            <div className='searchResultColLeft'>
                <h2>{stock.name}</h2>
                <h3>{stock.longName}</h3>
            </div>
            <div className='searchResultColRight'>
                <h3 className={stock.change ? (stock.change > 0 ? 'positiveSearch' : 'negativeSearch') : ''}>{stock.change ? (stock.change > 0 ? "+" + stock.change.toLocaleString('en-US', {
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
    );
};

const Search = () => {
    const [query, setQuery] = useState('');
    const [stockList, setStockList] = useState([]);
    const [focused, setFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchBox = useRef(null);

    let listCount = 0;

    useEffect(() => {
        async function getStock(name) {
            if (!isLoading) {setIsLoading(true)}
            const stockResponse = await fetch(`/record/name/${name}`);

            if (!stockResponse.ok) {
                const message = `An error occured: ${stockResponse.statusText}`;
                window.alert(message);
                return;
            }

            const stockListJSON = await stockResponse.json();

            if (JSON.stringify(stockListJSON) !== JSON.stringify(stockList)) {
                setStockList(stockListJSON);
            }

            if (isLoading) {setIsLoading(false)}
        }

        if (true) {
            listCount = 0;
            getStock(query.toUpperCase());
        } else {
            const timer = setTimeout(() => {
                listCount = 0;
                getStock(query.toUpperCase());

            }, 1000);

            return clearTimeout(timer);
        }

    }, [query]);

    function updateQuery() {
        if (searchBox && searchBox.current && searchBox.current.value !== query) {
            setQuery(searchBox.current.value);
        }

        /*if (searchBox && searchBox.current && document.activeElement === searchBox.current && !focused) {
            setFocused(true);
        } else if (searchBox && searchBox.current && document.activeElement !== searchBox.current && focused) {
            setFocused(false);
        }*/
    }

    return (
        <div className='searchBox'>
            <input type='search' onChange={updateQuery} onFocus={() => {setFocused(true)}} onBlur={() => {setFocused(false)}} ref={searchBox} placeholder="Search for a stock"/>
            {(query.length !== 0 && focused) &&
            <div className='searchResultsBox'>
                {stockList.map((stock) => {
                    if (listCount < 10) {
                        listCount++;
                        if (listCount === 1) {
                            return (
                                <div>
                                    <SearchResult stock={stock} />
                                </div>
                            );
                        } else {
                            return (
                                <div>
                                    <hr />
                                    <SearchResult stock={stock} />
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

export default Search;