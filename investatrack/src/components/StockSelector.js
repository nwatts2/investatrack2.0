import '../css/StockSelector.css';

const StockSelector = function ({stockList, currentStock, setStock}) {
    return (
        <div className='stockSelectorContainer'>
            <hr style={{margin: '0px 0px 10px 0px'}} />
            <div className='stockSelector'>
                {stockList.map((stock) => {
                    return <button className={currentStock && currentStock.name && currentStock.name === stock.name ? 'selected' : ''} onClick={() => {setStock(stock)}}>{stock.name}</button>
                })}
            </div>
            <hr style={{margin: '10px 0px 0px 0px'}} />
        </div>
       
    );
}

export default StockSelector;