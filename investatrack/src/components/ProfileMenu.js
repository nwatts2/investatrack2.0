import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import profileImg from '../images/coulten.jpg';
import '../css/ProfileMenu.css';

const ProfileMenu = ({ currentUser }) => {
    const [expand, setExpand] = useState(false);
    const [scrollHide, setScrollHide] = useState(false);
    const [mainStyle, setMainStyle] = useState({});
    const [menuStyle, setMenuStyle] = useState({});
    const menu = useRef(null);

    if (menu && menu.current) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (scrollHide) {
                        setScrollHide(false);
                    }
                    return;
                }
    
                if (!scrollHide) {
                    setScrollHide(true);

                    if (expand) {
                        setExpand(false);
                    }
                }
            });
        });
    
        observer.observe(menu.current);
    }

    useEffect(() => {
        let tempMainStyle, tempMenuStyle;

        if (scrollHide) {
            tempMainStyle = {
                top:'80px',
                right:'5px',
                padding:0,
                borderRadius:'50%',
                zIndex:3
            };

            tempMenuStyle = {
                top: '115px',
                right: '75px',
                width:'150px',
                borderRadius: '20px 0px 20px 20px'
            };

        } else {
            tempMainStyle = {};
            tempMenuStyle = {};
        }

        if (JSON.stringify(mainStyle) !== JSON.stringify(tempMainStyle)) {
            setMainStyle(tempMainStyle);
        }

        if (JSON.stringify(menuStyle) !== JSON.stringify(tempMenuStyle)) {
            setMenuStyle(tempMenuStyle);
        }

    }, [scrollHide]);

    

    function handleClick () {
        if (!expand) {setExpand(true)}
        else if (expand) {setExpand(false)}
    }

    return (
        <div className='profileMenuWrapper' ref={menu} tabindex='0' onBlur={() => {setTimeout(() => {setExpand(false)}, 100)}}>
            <div className='profileMenu' style={mainStyle} onClick={handleClick} >
                {!scrollHide &&
                    <div className='profileMenuText'>
                        <span>Welcome,</span>
                        <h3>{currentUser ? currentUser.fname : 'User'}</h3>
                    </div>
                }
                <img src={profileImg} />
            </div>
            {expand && 
                    <div className='profileMenuExpand' style={menuStyle}>
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