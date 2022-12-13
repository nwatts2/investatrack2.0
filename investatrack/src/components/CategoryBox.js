import '../css/CategoryBox.css';

const CategoryBox = ({ category }) => {
    return (
        <div className='categoryBox'>
            <h3>{category}</h3>
        </div>
    );
}

export default CategoryBox;