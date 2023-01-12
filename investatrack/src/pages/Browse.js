import { useEffect, useState } from 'react';
import Search from '../components/Search';
import TypeMenu from '../components/TypeMenu';
import Popular from '../components/Popular';
import Recommended from '../components/Recommended';
import Categories from '../components/Categories';
import News from '../components/News';
import ProfileMenu from '../components/ProfileMenu';

const Browse = () => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        getUser();

    }, []);
    
    async function getUser() {
        const userResponse = await fetch('/user/');

        if (!userResponse.ok) {
            const message = `An error occured: ${userResponse.statusText}`;
            window.alert(message);
            return;
        }

        const userJSON = await userResponse.json();

        if (JSON.stringify(currentUser) !== JSON.stringify(userJSON)) {
            setCurrentUser(userJSON);
        }
    }

    return (
        <div className='mainPage'>
            <ProfileMenu currentUser={currentUser} />
            <Search />
            <TypeMenu />
            <div className='titleSection'>
                <h1>BROWSE STOCKS</h1>
            </div>
            <div className='row'>
                <Popular />
                <Recommended currentUser={currentUser ? currentUser : {}} />
            </div>
            <Categories />
            <News />
        </div>
    );
}

export default Browse;