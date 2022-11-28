import Search from '../components/Search';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import TypeMenu from '../components/TypeMenu';
import Sell from '../components/Sell';

const Assets = () => {
    return (
        <div className='mainPage'>
            <Search />
            <TypeMenu />
            <h1>Your Money - $10,482.06</h1>
            <Graph />
            <div className='row'>
                <Sell />
                <StockInfo />
            </div>
        </div>
    );
}

export default Assets;