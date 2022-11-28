import Search from '../components/Search';
import Collections from '../components/Collections';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import News from '../components/News';

const Home = () => {
    return (
        <div className='mainPage'>
            <Search />
            <div className='row'>
                <Collections />
                <div className='homeMain'>
                    <h1>Your Money - $10,482.06</h1>
                    <hr />
                    <Graph />
                    <StockInfo />
                    <h2>Finance News</h2>
                    <News />
                </div>
            </div>
        </div>
       
    );
}

export default Home;