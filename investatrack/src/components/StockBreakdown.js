import { useEffect, useState } from 'react';
import '../css/StockBreakdown.css';

const StockBreakdown = ({ graphMode, stockList, currentStock, currentUser, worth, setWorth }) => {
    const [quantity, setQuantity] = useState(0);
    const [transaction, setTransaction] = useState(new Date(0));
    const [bestChange, setBestChange] = useState({name: '', value: 0});
    const [bestWorth, setBestWorth] = useState({name: '', value: 0});
    const [bestQuantity, setBestQuantity] = useState({name: '', value: 0});

    useEffect(() => {
        updateInfo();

    }, [JSON.stringify(currentStock), JSON.stringify(currentUser), graphMode]);

    function updateInfo () {
        if (graphMode === 'STOCKS') {
            if (currentUser && currentUser.stocks && currentStock) {
                let index = currentUser.stocks.findIndex((e) => e.name === currentStock.name);
                let date = new Date(0);
    
                for (let day of currentUser.history) {
                    for (let item of day.transactions) {
                        if (item.name === currentStock.name) {
                            date = new Date(day.date);
                        }
                    }
                }
    
                setTransaction(date);
    
                if (index !== -1) {
                    setQuantity(currentUser.stocks[index].quantity);
                    setWorth(() => {return currentUser.stocks[index].quantity * currentStock.price});
                } else {
                    setQuantity(0);
                    setWorth(0);
                }
            }
        } else if (graphMode === 'PERFORMANCE') {
            if (currentUser && currentUser.stocks && stockList) {
                let worth = {name:'', value: 0}, highQuantity = {name: '', value: 0}, change = {name: '', value: 0};

                for (let stock of stockList) {
                    for (let userStock of currentUser.stocks) {
                        if (userStock.name === stock.name) {
                            if (userStock.quantity * stock.price > worth.value) {
                                worth.value = userStock.quantity * stock.price;
                                worth.name = stock.name;
                            }

                            if (userStock.quantity > highQuantity.value) {
                                highQuantity.value = userStock.quantity;
                                highQuantity.name = stock.name;
                            }

                            if (stock.changePercent > change.value) {
                                change.value = stock.changePercent;
                                change.name = stock.name;
                            }
                        }
                    }
                }

                if (JSON.stringify(worth) !== JSON.stringify(bestWorth)) {
                    setBestWorth(worth);
                }

                if (JSON.stringify(highQuantity) !== JSON.stringify(bestQuantity)) {
                    setBestQuantity(highQuantity);
                }

                if (JSON.stringify(change) !== JSON.stringify(bestChange)) {
                    setBestChange(change);
                }
            }
        }
        
    }

    return (
        <div className='stockBreakdownWrapper'>
            <div className='stockBreakdownOuterBorder'>
                <div className='stockBreakdown'>
                    <h1>{currentStock ? currentStock.name : 'STOCK'}</h1>
                    <hr />
                    <span>{graphMode === 'STOCKS' ? 'Quantity Held:' : 'Best Performing:'}</span>
                    <h3>{graphMode === 'STOCKS' ? quantity + ' Shares' : bestChange.name + ` (${bestChange.value >= 0 ? '+' : ''}${bestChange.value.toLocaleString('en-US', {style: 'currency', currency: 'USD'})})`}</h3>
                    <span>{graphMode === 'STOCKS' ? 'Total Worth:' : 'Largest Investment:'}</span>
                    <h3>{graphMode === 'STOCKS' ? worth.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : bestWorth.name + ` (${bestWorth.value.toLocaleString('en-US', {style: 'currency', currency: 'USD'})})`}</h3>
                    <span>{graphMode === 'STOCKS' ? 'Last Transaction:' : 'Most Held Shares:'}</span>
                    <h3>{graphMode === 'STOCKS' ? (transaction.getTime() !== 0 ? transaction.toLocaleDateString('en-US', {weekday: "short", year:'numeric', month:'short', day: 'numeric'}) : 'N/A') : bestQuantity.name + ` (${bestQuantity.value} Shares)`}</h3>
                </div>
            </div>
        </div>
        
    );
}

export default StockBreakdown;