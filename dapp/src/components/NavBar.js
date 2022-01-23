import { NavLink } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
import CryptoLogin from './CryptoLogin';
import UserAddress from './UserAddress';

const NavBar = () => {
    const { isAuthenticated } = useMoralis();
    return (
            <nav className="navbar">
                <NavLink 
                    end 
                    className={(navData) => 
                        navData.isActive ? 'list-item-active' : 'list-item'} 
                    to="/"
                >
                    About
                </NavLink>
                <NavLink 
                    className={(navData) => 
                        navData.isActive ? 'list-item-active' : 'list-item'} 
                    to="/BrowseLoans"
                >
                    Browse Loans
                </NavLink>
                <NavLink 
                    className={(navData) => 
                        navData.isActive ? 'list-item-active' : 'list-item'} 
                    to="/BrowseFractionalLoans"
                >
                    Browse Fractional Loans
                </NavLink>
                <NavLink 
                    className={(navData) => 
                        navData.isActive ? 'list-item-active' : 'list-item'} 
                    to="/ProposeLoan"
                >
                    Propose Loan
                </NavLink>
                <NavLink
                    className={(navData) => 
                    navData.isActive ? 'list-item-active' : 'list-item'}
                    to="/UsersPositions"
                >
                    Users Positions
                </NavLink>
                    {isAuthenticated ? <UserAddress /> : <CryptoLogin />}     
        </nav>
    )
}

export default NavBar
