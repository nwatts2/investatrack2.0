import { useEffect, useState } from 'react';
import Search from '../components/Search';
import Collections from '../components/Collections';
import Graph from '../components/Graph';
import StockInfo from '../components/StockInfo';
import News from '../components/News';

const Home = () => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
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

        getUser();

    }, []);

    return (
        <div className='mainPage'>
            <Search />
            <div className='row'>
                <Collections currentUser={currentUser}/>
                <div className='homeMain'>
                    <h1>Your Money - {currentUser.sMoney ? currentUser.sMoney.toLocaleString('en-US', {
                        style: 'currency',
                        currency:'USD'
                    }) : '$0.00'}</h1>
                    <hr />
                    <Graph />
                    <StockInfo />
                    <h2>Finance News</h2>
                    <News />
                </div>
            </div>
        </div>
       
    );
}

export default Home;