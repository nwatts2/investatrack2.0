import { useState } from 'react';
import { Link } from 'react-router-dom';
import profileImg from '../images/coulten.jpg';
import '../css/ProfileMenu.css';

const ProfileMenu = ({ currentUser }) => {
    const [expand, setExpand] = useState(false);

    function handleClick () {
        if (!expand) {setExpand(true)}
        else if (expand) {setExpand(false)}
    }

    return (
        <div className='profileMenuWrapper' tabindex='0' onBlur={() => {setTimeout(() => {setExpand(false)}, 100)}}>
            <div className='profileMenu' onClick={handleClick} >
                <div className='profileMenuText'>
                    <span>Welcome,</span>
                    <h3>{currentUser ? currentUser.fname : 'User'}</h3>
                </div>
                <img src={profileImg} />
            </div>
            {expand && 
                <div className='profileMenuExpand'>
                    <ul>
                        <li>
                            <Link to='/assets'>Profile</Link>
                        </li>
                        <li>
                            <Link to=''>Badges</Link>
                        </li>
                        <li>
                            <Link to=''>Inbox</Link>
                        </li>
                        <li>
                            <Link to=''>Friends</Link>
                        </li>
                        <li>
                            <Link to=''>Settings</Link>
                        </li>
                        <li>
                            <Link to=''>Support</Link>
                        </li>
                        <li>
                            <Link to=''>Log Out</Link>
                        </li>
                    </ul>
                </div>
            }
        </div>
        
    );
}

export default ProfileMenu;