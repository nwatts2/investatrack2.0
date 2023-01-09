import { useEffect, useState } from 'react';
import '../css/StockBreakdown.css';

const StockBreakdown = ({ currentStock, currentUser }) => {
    const [quantity, setQuantity] = useState(0);
    const [worth, setWorth] = useState(0);
    const [transaction, setTransaction] = useState(new Date(0));

    useEffect(() => {
        updateInfo();

    }, [JSON.stringify(currentStock), JSON.stringify(currentUser)]);

    function updateInfo () {
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
            }
        }
    }

    return (
        <div className='stockBreakdownWrapper'>
            <div className='stockBreakdownOuterBorder'>
                <div className='stockBreakdown'>
                    <h1>{currentStock ? currentStock.name : 'STOCK'}</h1>
                    <hr />
                    <span>Quantity Held:</span>
                    <h3>{quantity} Shares</h3>
                    <span>Total Worth:</span>
                    <h3>{worth.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</h3>
                    <span>Last Transaction:</span>
                    <h3>{transaction.getTime() !== 0 ? transaction.toLocaleDateString('en-US', {weekday: "short", year:'numeric', month:'short', day: 'numeric'}) : 'N/A'}</h3>
                </div>
            </div>
        </div>
        
    );
}

export default StockBreakdown;