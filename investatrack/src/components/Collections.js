import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CollectionsGraph from '../components/CollectionsGraph';
import ModalSearch from '../components/ModalSearch';
import '../css/Collections.css';

const ListBox = ({ list }) => {
    return (
        <div className='listBox'>
        <div className={list && list.change ? (list.change > 0 ? 'stockBox positiveStock' : 'stockBox negativeStock') : 'stockBox'}>
                <div className='stockBoxColumn1'>
                    <h3>{list ? list.name : ''}</h3>
                    <span>{list && list.longName ? list.longName : ''}</span>
                </div>
                <div className='stockBoxColumn2'>
                    <CollectionsGraph currentStock={list} />
                </div>
                <div className='stockBoxColumn3'>
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

    }, [JSON.stringify(currentUser)]);

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
            <hr style={{width: '85%'}}/>
            <div className='upperDivider'>{'Space'}</div>
            <div className='listList'>
                {currentUser.lists && currentUser.lists.length > 0 ? currentUser.lists.map((item, index) => {
                    return (<ListBox />);
                }) :
                    <div className='noList'>
                        <span>Looks like you don't have any lists yet</span>
                        <button onClick={startList} >Start a List</button>
                    </div>
                }
            </div>
            <div className='lowerDivider'>{'Space'}</div>
            <hr style={{width: '85%'}}/>
            <div className='roundDivider'>Your Stocks</div>
            <hr style={{width: '85%'}}/>
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