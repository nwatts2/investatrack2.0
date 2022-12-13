import CategoryBox from '../components/CategoryBox';
import '../css/Categories.css';

const Categories = () => {
    return (
        <div className='categories'>
            <CategoryBox category={'Financial Services'}/>
            <CategoryBox category={'Healthcare'}/>
            <CategoryBox category={'Technology'}/>
            <CategoryBox category={'Industrials'}/>
            <CategoryBox category={'Consumer Cyclical'}/>
            <CategoryBox category={'Communication Services'}/>
            <CategoryBox category={'Consumer Defensive'}/>
            <CategoryBox category={'Basic Materials'}/>
            <CategoryBox category={'Energy'}/>
            <CategoryBox category={'Real Estate'}/>
            <CategoryBox category={'Utilities'}/>
            <CategoryBox category={'Other'}/>
        </div>
    );
}

export default Categories;