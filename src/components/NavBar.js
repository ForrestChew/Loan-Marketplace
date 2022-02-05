import { NavLink } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
import CryptoLogin from './CryptoLogin';
import UserAddress from './UserAddress';

const NavBar = () => {
  const { isAuthenticated } = useMoralis();
  return (
    <nav className="navbar">
      <NavLink
        className={(navData) =>
          navData.isActive ? 'list-item-active' : 'list-item'
        }
        to="/"
        end
      >
        Propose Loan
      </NavLink>
      <NavLink
        className={(navData) =>
          navData.isActive ? 'list-item-active' : 'list-item'
        }
        to="/browse-loans"
      >
        Browse Loans
      </NavLink>
      <NavLink
        className={(navData) =>
          navData.isActive ? 'list-item-active' : 'list-item'
        }
        to="/browse-fractional-loans"
      >
        Browse Fractional Loans
      </NavLink>
      <NavLink
        className={(navData) =>
          navData.isActive ? 'list-item-active' : 'list-item'
        }
        to="/users-positions"
      >
        Users Positions
      </NavLink>
      {/* Displays the user's address if they are logged in. Otherwise the login button is displayed */}
      {isAuthenticated ? <UserAddress /> : <CryptoLogin />}
    </nav>
  );
};

export default NavBar;
