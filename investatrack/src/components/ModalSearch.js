import { useEffect, useRef, useState } from 'react';
import '../css/ModalSearch.css';

const ModalSearchResult = ({ stock, newList, setNewList }) => {
    function addStock(thisStock) {
        const index = newList.findIndex((thisEntry) => {return thisEntry.name === thisStock.name})
        const tempList = [];

        for (let entry of newList) {
            tempList.push(entry);
        }

        if (index === -1) {
            tempList.push({
                stockID: thisStock._id,
                name: thisStock.name,
                longName: thisStock.longName
            });

        } else {
            tempList[index] = {
                stockID: thisStock._id,
                name: thisStock.name,
                longName: thisStock.longName
            };
        }

        if (JSON.stringify(tempList) !== JSON.stringify(newList)) {
            setNewList(tempList);
        }
    }

    return (
        <div className='modalSearchResult' onClick={() => {addStock(stock)}}>
            <div className='modalSearchResultColLeft'>
                <h2>{stock.name}</h2>
                <h3>{stock.longName}</h3>
            </div>
            <div className='modalSearchResultColRight'>
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

const ModalSearch = ({ newList, setNewList }) => {
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
        <div className='modalSearchBox'>
            <input type='search' onChange={updateQuery} onFocus={() => {setFocused(true)}} onBlur={() => {setTimeout(() => {setFocused(false)}, 100)}} ref={searchBox} placeholder="Search for a stock"/>
            {(query.length !== 0 && focused) &&
            <div className='modalSearchResultsBox'>
                {stockList.map((stock) => {
                    if (listCount < 10) {
                        listCount++;
                        if (listCount === 1) {
                            return (
                                <div>
                                    <ModalSearchResult newList={newList} setNewList={setNewList} stock={stock} />
                                </div>
                            );
                        } else {
                            return (
                                <div>
                                    <hr />
                                    <ModalSearchResult newList={newList} setNewList={setNewList} stock={stock} />
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

export default ModalSearch;