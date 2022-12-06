import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Search.css';

const SearchResult = ({ stock }) => {
    return (
        <Link to={`/stocks/${stock.name}`}>
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
        </Link>
    );
};

const Search = () => {
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
        <div className='searchBox'>
            <input type='search' onChange={updateQuery} onFocus={() => {setFocused(true)}} onBlur={() => {setTimeout(() => {setFocused(false)}, 100)}} ref={searchBox} placeholder="Search for a stock"/>
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