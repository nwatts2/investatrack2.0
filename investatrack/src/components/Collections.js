import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CollectionsGraph from '../components/CollectionsGraph';
import ModalSearch from '../components/ModalSearch';
import '../css/Collections.css';

const ListBox = ({ list }) => {
    let stockString = '';
    let stockLimit = 0;

    if (list && list.stocks) {
        for (let stock of list.stocks) {
            if (stock.name) {
                stockString += stock.name + ', ';
            }
        }
    }

    stockString = stockString.slice(0, stockString.length - 2);

    return (
        <div className={list && list.change ? (list.change > 0 ? 'listBox positiveStock' : 'listBox negativeStock') : 'listBox'}>
                <h2>{list ? list.name : ''}</h2>
                <div className='listBoxRow'>
                    <div className='listBoxColumn1'>
                        {list.stocks.map((stock) => {
                            if (stockLimit < 3) {
                                return <span>{stock.name}</span>;
                            } else if (stockLimit === 4) {
                                return <span>{stock.name + '...'}</span>;
                            } else {
                                return;
                            }
                        })}
                    </div>
                    <div className='listBoxColumn2'>
                        <CollectionsGraph currentStock={list} />
                    </div>
                    <div className='listBoxColumn3'>
                        <h4>{list && list.change ? (list.change > 0 ? "+" + list.change.toLocaleString('en-US', {
                                style: 'currency',
                                currency:'USD'
                            }) : list.change.toLocaleString('en-US', {
                                style: 'currency',
                                currency:'USD'
                            })) : ''}</h4>
                        <h3>{list && list.price ? list.price.toLocaleString('en-US', {
                                style: 'currency',
                                currency:'USD'
                            }) : 'Unknown'}</h3>
                    </div>
                </div>
        </div>
    )
};

const ListModalEntry = ({ listEntry, newList, setNewList }) => {
    function deleteItem(entry) {
        const index = newList.findIndex((thisEntry) => {return thisEntry.name === entry.name})
        const tempList = [];

        let i = 0;
        let length = newList.length;

        while (i < length) {
            if (i !== index) {
                tempList.push(newList[i]);
            }

            i++;
        }

        if (JSON.stringify(tempList) !== JSON.stringify(newList)) {
            setNewList(tempList);
        }
    }
    
    return (
        <div className='listEntry'>
            <div className='listEntryCol1'>
                <h2>{listEntry.name}</h2>
                <span>{listEntry.longName}</span>
            </div>
            <div className='listEntryCol2'>
                <button onClick={() => {deleteItem(listEntry)}}>x</button>
            </div>
        </div>
    );
}

const ListModal = ({ currentUser, setMakeList, setNotificationText, setNotificationIsNegative, setRefresh }) => {
    const [newList, setNewList] = useState([]);
    const listName = useRef(null);

    function handleSubmit(e) {
        e.preventDefault();

        const sendObj = {
            user: currentUser._id,
            listName: listName.current.value !== '' ? listName.current.value : '',
            stocks: newList
        };

        if (sendObj.listName !== '' && sendObj.stocks.length > 0) {
            fetch('/user/updateList/', {
                method: 'POST',
                body: JSON.stringify(sendObj),
                headers: {
                    "Accept": 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(
                (response) => (response.json())
            ).then((response) => {
                if (response.status === 'success') {
                    setNotificationText('List successfully created');
                    setTimeout(() => {setNotificationText('')}, 5000);
                    setNotificationIsNegative(false);
                    setRefresh((c) => {return c + 1});
                    setMakeList(false);
                    
                } else if (response.status === 'fail') {
                    setNotificationText('List creation failed');
                    setTimeout(() => {setNotificationText('')}, 5000);
                    setNotificationIsNegative(true);
                } else if (response.status === 'nameAlreadyExists') {
                    setNotificationText('You already have a list with this name. Please try another one.');
                    setTimeout(() => {setNotificationText('')}, 5000);
                    setNotificationIsNegative(true);
                } else if (response.status === 'emptyName') {
                    setNotificationText('Please enter a name for your list');
                    setTimeout(() => {setNotificationText('')}, 5000);
                    setNotificationIsNegative(true);
                } else if (response.status === 'emptyStocks') {
                    setNotificationText('Please select some stocks for your list');
                    setTimeout(() => {setNotificationText('')}, 5000);
                    setNotificationIsNegative(true);
                }
            });

        } else if (sendObj.listName === '') {
                    setNotificationText('Please enter a name for your list');
                    setTimeout(() => {setNotificationText('')}, 5000);
                    setNotificationIsNegative(true);
        } else if (sendObj.stocks.length === 0) {
            setNotificationText('Please select some stocks for your list');
            setTimeout(() => {setNotificationText('')}, 5000);
            setNotificationIsNegative(true);
        }

        

        return;
    }

    return (
        <div className='listModalWrapper'>
            <div className='listModal'>
                <h1>Start a List</h1>
                <ModalSearch newList={newList} setNewList={setNewList} />
                <hr />
                <div className='selectedList'>
                    {newList.length > 0 ? newList.map((listEntry) => {
                        return (<ListModalEntry listEntry={listEntry} newList={newList} setNewList={setNewList} />)
                    }) : <span>Search for a stock to start a list</span>}
                </div>
                <hr />
                <div className='listModalNameSection'>
                    <span>What do you want to call this list?</span>
                    <input type='text' ref={listName} placeholder='Enter a name' required />
                </div>
                <form onSubmit={(e) => {handleSubmit(e)}} className='listModalButtonsCreate' method='POST'>
                    <button type='submit'>Create List</button>
                    <button onClick={() => {setMakeList(false)}} >Cancel</button>
                </form>
            </div>
        </div>
    );
}

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

const Collections = ({ currentUser, setNotificationText, setNotificationIsNegative, setRefresh }) => {
    const [stockList, setStockList] = useState([]);
    const [lists, setLists] = useState([]);
    const [listStocks, setListStocks] = useState([]);
    const [makeList, setMakeList] = useState(false);

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

        if (JSON.stringify(currentUser.lists) !== JSON.stringify(lists)) {setLists(currentUser.lists)}

    }, [JSON.stringify(currentUser)]);

    useEffect(() => {
        getListInfo()

    }, [JSON.stringify(lists)]);

    useEffect(() => {
        calcListInfo();

    }, [listStocks]);

    async function getListInfo () {
        const neededStockArray = [];
        let neededStockString = '';

        for (let list of lists) {
            if (list.stocks) {
                for (let stock of list.stocks) {
                    if (!neededStockArray.includes(stock.name)) {
                        neededStockArray.push(stock.name);
                    }
                }
            }
        }

        for (let stock of neededStockArray) {
            neededStockString += stock + '-';
        }

        neededStockString = neededStockString.slice(0, neededStockString.length - 1);

        const stockResponse = await fetch(`/stocks/multiple/${neededStockString}`);

        if (!stockResponse.ok) {
            const message = `An error occured: ${stockResponse.statusText}`;
            window.alert(message);
            return;
        }

        const stockJSON = await stockResponse.json();        

        if (JSON.stringify(stockJSON) !== JSON.stringify(listStocks)) {
            setListStocks(stockJSON);
        }
    }

    function calcListInfo () {
        for (let list of lists) {
            let price = 0, change = 0, history = [], recentHistory = [], finalRecent = [];

            for (let stock of list.stocks) {
                for (let neededStock of listStocks) {
                    if (stock.name === neededStock.name) {
                        price += neededStock.price;

                        for (let day of neededStock.history) {
                            const index = history.findIndex(e => e.date === day.date);
                            let tempObj = {};

                            if (index > -1) {
                                history[index].open += day.open;
                                history[index].close += day.close;
                                history[index].high += day.high;
                                history[index].low += day.low;

                            } else {
                                tempObj.date = day.date;
                                tempObj.open = day.open;
                                tempObj.close = day.close;
                                tempObj.high = day.high;
                                tempObj.low = day.low;

                                history.push(tempObj);

                            }

                        }

                        for (let day of neededStock.recentHistory) {
                            const index = recentHistory.findIndex(e => e.date === day.date);
                            let tempObj = {};

                            if (index > -1) {
                                recentHistory[index].price += day.price;
                                recentHistory[index].activeStocks.push(stock.name);

                            } else {
                                tempObj.date = day.date;
                                tempObj.price = day.price;
                                tempObj.activeStocks = [];
                                tempObj.activeStocks.push(stock.name);

                                recentHistory.push(tempObj);
                            }

                        }

                        list.price = price;
                        list.history = history;

                        for (let item of recentHistory) {
                            if (item.activeStocks.length === listStocks.length) {
                                finalRecent.push(item);
                            }
                        }

                        list.recentHistory = finalRecent;

                        const length = finalRecent.length;

                        if (length > 1) {
                            change = finalRecent[finalRecent.length - 1].price - finalRecent[finalRecent.length - 2].price;
                        } else {
                            change = 0;
                        }

                        list.change = change;

                        break;
                    }
                }
            }
        }

        setLists(lists);
    }

    function startList () {
        if (!makeList) {setMakeList(true)}
    }

    return (
        <div className='collections'>
            <div className='collectionsTitle'>
                <h2>Collections</h2>
                <span>A quick view of your assets</span>
            </div>
            <hr style={{width: '95%'}}/>
            <div className='roundDivider'>Your Lists</div>
            <div className='upperDivider'>{'Space'}</div>
            <div className='stockList'>
                {currentUser.lists && currentUser.lists.length > 0 ? currentUser.lists.map((item, index) => {
                    return (<div className='stockTable'><ListBox list={item} /></div>);
                }) :
                    <div className='noList'>
                        <span>Looks like you don't have any lists yet</span>
                    </div>
                }

                <button onClick={startList} >Start a List</button>
            </div>
            <div className='lowerDivider'>{'Space'}</div>
            <div className='roundDivider'>Your Stocks</div>
            <div className='upperDivider'>{'Space'}</div>
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
            <div className='lowerDivider'>{'Space'}</div>
            {makeList &&
                <ListModal currentUser={currentUser} setMakeList={setMakeList} setNotificationText={setNotificationText} setNotificationIsNegative={setNotificationIsNegative} setRefresh={setRefresh} />
            }
        </div>
    );
}

export default Collections;