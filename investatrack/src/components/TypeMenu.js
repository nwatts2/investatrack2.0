import '../css/TypeMenu.css';

const TypeMenu = () => {
    return (
        <div className='typeMenu'>
            <input type='radio' name='typeMenu' id='radioAll' defaultChecked={true}/>
            <label for='radioAll'>All</label>

            <input type='radio' name='typeMenu' id='radioStocks' />
            <label for='radioStocks'>Stocks</label>

            <input type='radio' name='typeMenu' id='radioCrypto' />
            <label for='radioCrypto'>Crypto</label>
        </div>
    );
}

export default TypeMenu;