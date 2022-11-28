import { Link } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
    return (
        <nav className='row'>
            <ul className='row'>
                <li>
                    <Link to='/assets'>My Assets</Link>
                </li>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/browse'>Browse</Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;