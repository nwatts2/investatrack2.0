import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import financial from '../images/financial.png';
import healthcare from '../images/healthcare.jpg';
import technology from '../images/technology.jpg';
import industrials from '../images/industrials.png';
import cyclical from '../images/cyclical.jpg';
import communication from '../images/communication.jpg'; 
import defensive from '../images/defensive.jpg';
import materials from '../images/materials.jpg';
import energy from '../images/energy.png';
import realestate from '../images/realestate.jpg';
import utilities from '../images/utilities.jpg';
import other from '../images/other.jpg';
import '../css/Categories.css';

const CategoryBox = ({ category, imagePath, title, selected, setSelected }) => {
    return (
        <div className={selected === category ? 'categoryBox selectedCategory' : 'categoryBox'} onClick={() => {setSelected(category)}}>
            <img src={imagePath} />
            <h3>{title}</h3>
        </div>
    );
}

const StockResult = ({ stock }) => {
    return (
        <Link className='resultsBoxLink' to={`/stocks/${stock.name}`}>
        <div className='resultsBoxResult'>
            <div className='resultsBoxResultColLeft'>
                <h2>{stock.name}</h2>
                <h3>{stock.longName}</h3>
            </div>
            <div className='resultsBoxResultColRight'>
                <h3 className={stock.change ? (stock.change > 0 ? 'positiveEntry' : 'negativeEntry') : ''}>{stock.change ? (stock.change > 0 ? "+" + stock.change.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    }) : stock.change.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    })) : ''}</h3>
                <h2>{stock.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    })}</h2>
            </div>
        </div>
        </Link>
    );
}

const Categories = () => {
    const [selected, setSelected] = useState('Financial Services');
    const [stockList, setStockList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    let limit = 10;

    useEffect(() => {
        async function getSector () {
            if (!isLoading) {setIsLoading(true)}
            const stockResponse = await fetch(`/stocks/sector/${selected}/${limit}`);

            if (!stockResponse.ok) {
                const message = `An error occured: ${stockResponse.statusText}`;
                window.alert(message);
                return;
            }

            const stockJSON = await stockResponse.json();

            if (JSON.stringify(stockJSON) !== JSON.stringify(stockList)) {
                setStockList(stockJSON);
            }
        }
        
        getSector().then(() => {
            setIsLoading(false)
        });

    }, [selected]);

    return (
        <div className='categoriesContainer'>
            <hr style={{borderBottom: '5px solid #2e4766'}}/>
            <div className='categoriesTitle'>
                <h2>Categories</h2>
            </div>
            <div className='categories'>
                <CategoryBox selected={selected} setSelected={setSelected} title='Financial' imagePath={financial} category={'Financial Services'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Healthcare' imagePath={healthcare} category={'Healthcare'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Technology' imagePath={technology} category={'Technology'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Industrials' imagePath={industrials} category={'Industrials'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Cyclical' imagePath={cyclical} category={'Consumer Cyclical'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Communications' imagePath={communication} category={'Communication Services'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Defensive' imagePath={defensive} category={'Consumer Defensive'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Materials' imagePath={materials} category={'Basic Materials'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Energy' imagePath={energy} category={'Energy'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Real Estate' imagePath={realestate} category={'Real Estate'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Utilities' imagePath={utilities} category={'Utilities'}/>
                <CategoryBox selected={selected} setSelected={setSelected} title='Other' imagePath={other} category={'Other'}/>
            </div>
            <div className='resultsBox' style={isLoading ? {minHeight: '400px'} : {minHeight: 'fit-content'}}>
                {isLoading &&
                    <Spinner />
                }
                {stockList.length > 0 ? stockList.map((stock) => {
                    return (<StockResult stock={stock} />);
                }) : ''
                }

            </div>
            <hr style={{borderTop: '5px solid #2e4766'}} />
        </div>
    );
}

export default Categories;