import { useEffect, useState } from 'react';
import Search from '../components/Search';
import TypeMenu from '../components/TypeMenu';
import Popular from '../components/Popular';
import Recommended from '../components/Recommended';
import Categories from '../components/Categories';
import News from '../components/News';

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
            <Search />
            <TypeMenu />
            <h1>Browse - Trending Stocks</h1>
            <div className='row'>
                <Popular />
                <Recommended currentUser={currentUser ? currentUser : {}} />
            </div>
            <h2>Categories</h2>
            <Categories />
            <News />
        </div>
    );
}

export default Browse;