import Search from '../components/Search';
import TypeMenu from '../components/TypeMenu';
import Popular from '../components/Popular';
import TopPerformers from '../components/TopPerformers';
import Categories from '../components/Categories';
import News from '../components/News';

const Browse = () => {
    return (
        <div className='mainPage'>
            <Search />
            <TypeMenu />
            <h1>Browse - Trending Stocks</h1>
            <div className='row'>
                <Popular />
                <TopPerformers />
            </div>
            <h2>Categories</h2>
            <Categories />
            <h2>Finance News</h2>
            <News />
        </div>
    );
}

export default Browse;