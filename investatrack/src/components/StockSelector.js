import '../css/StockSelector.css';

const StockSelector = function ({stockList, currentStock, setStock}) {
    return (
        <div className='stockSelectorContainer'>
            <hr style={{margin: '0px 0px 10px 0px', width:'100%'}} />
            <div className='stockSelector'>
                {stockList.map((stock) => {
                    if (stock) {
                        return <button className={currentStock && currentStock.name && currentStock.name === stock.name ? 'selected' : ''} onClick={() => {setStock(stock)}}>{stock.name}</button>
                    } else {return}
                })}
            </div>
            <hr style={{margin: '10px 0px 0px 0px', width:'100%'}} />
        </div>
       
    );
}

export default StockSelector;