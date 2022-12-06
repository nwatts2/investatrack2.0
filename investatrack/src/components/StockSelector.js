import { useEffect, useState } from 'react';
import '../css/StockSelector.css';

const StockSelector = function ({stockList, setStock}) {
    return (
        <div className='stockSelector'>
            {stockList.map((stock) => {
                return <button onClick={() => {setStock(stock)}}>{stock.name}</button>
            })}
        </div>
    );
}

export default StockSelector;