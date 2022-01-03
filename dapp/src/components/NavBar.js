import { useMoralis } from 'react-moralis';
import { NavLink } from 'react-router-dom';
import CryptoLogin from './CryptoLogin';
import UserAddress from './UserAddress';

const NavBar = () => {
    const { isAuthenticated } = useMoralis();
    return (
            <nav className='navbar'>
                <NavLink 
                    end 
                    className={(navData) => 
                        navData.isActive ? 'list-item-active' : 'list-item'} 
                    to='/'
                    >
                        ABOUT
                </NavLink>
                <NavLink 
                    className={(navData) => 
                        navData.isActive ? 'list-item-active' : 'list-item'} 
                    to='/BrowseLoans'
                    >
                        BROWSE LOANS
                </NavLink>
                <NavLink 
                    className={(navData) => 
                        navData.isActive ? 'list-item-active' : 'list-item'} 
                    to='/ProposeLoan'
                    >
                        PROPOSE LOAN
                </NavLink>
                <NavLink 
                    className={(navData) => 
                        navData.isActive ? 'list-item-active' : 'list-item'} 
                    to='/Lend'
                    >
                        LEND
                </NavLink>
                {isAuthenticated ? <UserAddress /> : <CryptoLogin />}     
        </nav>
    )
}

export default NavBar
