import { useState, useEffect, useRef } from 'react';
import '../css/BuySell.css';

const ConfirmModal = ({mode, quantityAmount, setInitialized, setFinalized, currentStock}) => {
    function handleConfirm() {
        setFinalized(true);
        setInitialized(false);
    }

    return (
        <div className='modalWrapper'>
            <div className='modal'>
                <h1>Confirm Purchase</h1>
                <span>{`Are you sure you want to ${mode.toLowerCase()} ${quantityAmount} share${quantityAmount !== 1 ? 's' : ''} of ${currentStock.name} for ${(quantityAmount * currentStock.price).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                })}?`}</span>
                <div className='modalButtons'>
                    <button onClick={handleConfirm}>Confirm</button>
                    <button onClick={() => {setInitialized(false)}}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

const BuySell = ({ mode, setMode, currentUser, currentStock, setRefresh, setNotificationText, setNotificationIsNegative }) => {
    const [initialized, setInitialized] = useState(false);
    const [finalized, setFinalized] = useState(false);
    const [conditionals, setConditionals] = useState({canBuy: false, canSell: false});
    const [quantityAmount, setQuantityAmount] = useState(-1);
    const [heldQuantity, setHeldQuantity] = useState(0);
    const quantity = useRef(null);

    useEffect(() => {
        if (quantity.current) {
            quantity.current.value = quantityAmount;
        }

    }, [quantityAmount, quantity.current])

    useEffect(() => {
        if (finalized) {
            const sendObj = {};

            sendObj.user = currentUser._id;
            sendObj.stockName = currentStock.name;
            sendObj.stockID = currentStock._id;
            sendObj.quantity = quantityAmount;
            sendObj.mode = mode;

            finalizePurchase(sendObj);
            setFinalized(false);
            setMode('');
        }

    }, [finalized])

    useEffect(() => {
        if (currentUser && currentUser.cMoney && currentStock && currentStock.price && currentStock.name) {
            let updateSell = false;

            if (currentUser.cMoney >= currentStock.price) {
                if (!conditionals.canBuy) {setConditionals({...conditionals, canBuy: true})}
            } else if (currentUser.cMoney < currentStock.price && conditionals.canBuy) {setConditionals({...conditionals, canBuy: false})}
    
            for (let stock of currentUser.stocks) {
                if (stock.name === currentStock.name) {
                    if (heldQuantity !== stock.quantity) {setHeldQuantity(stock.quantity)}
                    if (stock.quantity >= quantityAmount) {updateSell = true}
                } 
            }
    
            if (updateSell && !conditionals.canSell) {setConditionals({...conditionals, canSell: true})}
            else if (!updateSell && conditionals.canSell) {setConditionals({...conditionals, canSell: false})}
        }

    }, [currentStock, currentUser, conditionals, quantityAmount, finalized]);

    async function initializePurchase() {
        if (quantityAmount > 0) {
            setInitialized(true);
        } else {
            window.alert("Please enter a quantity greater than 0.");
        }
    }

    function finalizePurchase(sendObj) {
        fetch('/user/exchange/', {
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
                setNotificationText('Stock exchange successful');
                setTimeout(() => {setNotificationText('')}, 5000);
                setNotificationIsNegative(false);
                setRefresh((c) => {return c + 1});
                
            } else if (response.status === 'fail') {
                setNotificationText('Stock exchange failed');
                setTimeout(() => {setNotificationText('')}, 5000);
                setNotificationIsNegative(true);
            } else if (response.status === 'insufficient funds') {
                setNotificationText('You do not have the funds needed to make this purchase.');
                setTimeout(() => {setNotificationText('')}, 5000);
                setNotificationIsNegative(true);
            }
        });

        return;
    }

    function selectMode(newMode) {
        if (newMode === mode && mode !== '') {
            if (mode === 'BUY' || mode === 'SELL') {
                initializePurchase();
            }

        } else if (newMode !== mode) {
            if (newMode === '' && mode !== newMode) {setMode('')}
            else if (mode !== newMode) {setMode(newMode)}
    
            setQuantityAmount(0);
        }
        
    }

    function updateQuantity() {
        if (quantity.current) {
            let newValue = Number(quantity.current.value);

            if (!isNaN(newValue)) {
                if (newValue !== quantityAmount) {
                    setQuantityAmount(newValue);
                } else {
                    if (quantityAmount !== 0) {
                        setQuantityAmount(0);
                    }
                }
            }
        }
    }

    function changeQuantity (method) {
        if (method === 'INCREMENT') {
            if (mode === 'SELL' && quantityAmount < heldQuantity) {
                setQuantityAmount((c) => c + 1);

            } else if (mode === 'BUY' && quantityAmount < (currentUser.cMoney / currentStock.price)) {
                setQuantityAmount((c) => c + 1);

            }
        } else if (method === 'DECREMENT') {
            if (quantityAmount > 0) {
                setQuantityAmount((c) => c - 1);
            }
        }
    }

    function handleBlur() {
        if (quantity.current && currentUser && currentStock) {
            if (quantity.current.value === '') {
                quantity.current.value = quantityAmount;

            } else if (isNaN(Number(quantity.current.value))) {
                quantity.current.value = 0;
                setQuantityAmount(0);

            } else if (mode === 'SELL' && Number(quantity.current.value) >= heldQuantity) {
                quantity.current.value = heldQuantity;
                setQuantityAmount(heldQuantity);

            } else if (mode === 'BUY' && Number(quantity.current.value) >= (currentUser.cMoney / currentStock.price)) {
                quantity.current.value = Math.floor(currentUser.cMoney / currentStock.price);
                setQuantityAmount(Math.floor(currentUser.cMoney / currentStock.price));

            }
        }
        
    }

    function handleSubmit (e) {
        e.preventDefault();

        if (quantity.current && currentStock && currentUser) {
            initializePurchase();
        }

        return;
    }

    return (
        <div className='buySellWrapper'>
            <hr />
            <div className='buySell'>
                <h2>Exchange {currentStock ? currentStock.name : 'Stock'}</h2>
                <div className='exchangeInfo'>
                    <h3 style={{margin:0}} >Balance</h3>
                    <span>{currentUser.cMoney ? currentUser.cMoney.toLocaleString('en-US', {style:'currency', currency:'USD'}) : '$0.00'}</span>
                    <h3>Amount Owned</h3>
                    <span>{heldQuantity.toLocaleString('en-US', {minimumFractionDigits: 0})} share{heldQuantity !== 1 ? 's' : ''}</span>
                </div>
                <form onSubmit={(e) => {(initialized && (mode === 'BUY' || mode === 'SELL')) ? handleSubmit(e) : e.preventDefault()}} method='POST'>
                    <hr />
                    {(mode === 'BUY' || mode === 'SELL')  &&
                        <div className='quantity'>
                            <h3 style={{margin:0, textDecoration: 'none'}}>Quantity</h3>
                            <div className='quantityInput'>
                                <button onClick={() => {changeQuantity('DECREMENT')}}>{'-'}</button>
                                <input type='text' onChange={updateQuantity} onBlur={handleBlur} ref={quantity} />
                                <button onClick={() => {changeQuantity('INCREMENT')}}>{'+'}</button>

                            </div>
                        </div>  
                    }
                    {(mode === 'BUY' || mode === '') &&
                        <button onClick={() => {selectMode('BUY')}} disabled={conditionals.canBuy ? false : true}>BUY{currentStock.name ? ' ' + currentStock.name : ''}</button>
                    }
                    {(mode === 'SELL' || mode === '') &&
                        <button onClick={() => {selectMode('SELL')}} disabled={conditionals.canSell ? false : true}>SELL{currentStock.name ? ' ' + currentStock.name : ''}</button>
                    }
                    {mode !== '' &&
                        <button onClick={() => {selectMode('')}}>CANCEL</button>
                    }
                    <hr />
                </form>
                
                {initialized &&
                    <ConfirmModal mode={mode} currentStock={currentStock} quantityAmount={quantityAmount} setInitialized={setInitialized} setFinalized={setFinalized} />
                }
            </div>
            <hr />
        </div>
    );
}

export default BuySell;