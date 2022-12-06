import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const tempUrl = window.location.href.split('/');
        if (tempUrl[tempUrl.length - 1] !== url) {
            setUrl(tempUrl[tempUrl.length - 1]);
        }

    }, [navigate])

    return (
        <nav className='row'>
            <ul className='row'>
                <li>
                    <Link to='/assets' style={url === 'assets' ? {fontWeight: 'bold'} : {}}>My Assets</Link>
                </li>
                <li>
                    <Link to='/' style={url === '' ? {fontWeight: 'bold'} : {}}>Home</Link>
                </li>
                <li>
                    <Link to='/browse' style={url === 'browse' ? {fontWeight: 'bold'} : {}}>Browse</Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;