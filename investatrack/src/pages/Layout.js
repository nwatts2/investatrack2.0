import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const Layout = () => {
    return (
        <div className='fullBody'>
            <NavBar />
            <div className='scrollable'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default Layout;