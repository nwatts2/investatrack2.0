import { useEffect, useState } from 'react';
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
        <div className={selected === title ? 'categoryBox selectedCategory' : 'categoryBox'} onClick={() => {setSelected(title)}}>
            <img src={imagePath} />
            <h3>{title}</h3>
        </div>
    );
}

const Categories = () => {
    const [selected, setSelected] = useState('FINANCIAL');

    useEffect(() => {


    }, []);

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
            <hr style={{borderTop: '5px solid #2e4766'}} />
        </div>
    );
}

export default Categories;