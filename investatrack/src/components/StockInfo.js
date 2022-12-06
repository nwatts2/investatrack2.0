import '../css/StockInfo.css';

const StockInfo = ({ stock }) => {
    return (
        <div className='stockInfo'>
            <div className='stockInfoRow'>
            <h3>Price: {stock.price ? stock.price.toLocaleString('en-US', {
                            style: 'currency',
                            currency:'USD'
                        }) : 'N/A'}</h3>
                    <h3>Day High: {stock.dayHigh ? stock.dayHigh.toLocaleString('en-US', {
                            style: 'currency',
                            currency:'USD'
                        }) : 'N/A'}</h3>
                    <h3>Day Low: {stock.dayLow ? stock.dayLow.toLocaleString('en-US', {
                            style: 'currency',
                            currency:'USD'
                        }) : 'N/A'}</h3>
                    <h3>Volume: {stock.volume ? stock.volume.toLocaleString() : 'N/A'}</h3>
            </div>
            <div className='stockInfoRow'>
                <div className='stockInfoCol'>
                    <div className='stockInfoRow'>
                        <div className='stockInfoColLeft'>
                            <div className='stockInfoChange'>
                                <h3>Change:</h3>
                                <h2 style={stock.change && stock.change > 0 ? {color: 'green'} : {color: 'red'}}>{stock.change ? stock.change.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency:'USD'
                                    }) : ''}</h2>
                            </div>
                            <div className='stockInfoChange'>
                                <h3>Change Percent:</h3>
                                <h2 style={stock.change && stock.change > 0 ? {color: 'green'} : {color: 'red'}}>{stock.changePercent ? stock.changePercent.toLocaleString('en-US', {
                                        style: 'percent',
                                        currency:'USD',
                                        minimumFractionDigits: 4
                                    }) : ''}</h2>
                            </div>
                            
                        </div>
                        <div className='verticalDivision'></div>
                        <div className = 'stockInfoColCenter'>
                            <div className='stockInfoTitle'>
                                <h2>{stock && stock.longName ? `${stock.longName}${stock.name ? ` (${stock.name})` : ''}` : (stock.name ? stock.name : '')}</h2>
                                <h4>{stock.industry ? stock.industry : ''}{(stock.industry && stock.sector) ? ' - ' : ''}{stock.sector ? stock.sector : ''}</h4>
                            </div>
                            <span>&emsp;{stock.summary ? stock.summary : ''}</span>
                        </div>
                        <div className='verticalDivision'></div>
                    </div>
                </div>
                <div className='stockInfoColRight'>
                    <a target="_blank" href={stock.website ? stock.website : ''}><img src={stock.logoURL ? stock.logoURL : ''} /></a>
                    <h4>{stock.address ? stock.address : ''}</h4>
                    <h4>{stock.city ? stock.city + ', ' : ''}{stock.state ? stock.state + ' ' : ''}{stock.zip ? stock.zip : ''}</h4>
                    <h4>{stock.country ? stock.country : ''}</h4>
                </div>
            </div>
            
        </div>
    );
}

export default StockInfo;