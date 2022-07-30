import { NavLink } from "react-router-dom";
import AuthButton from "../../Auth/AuthButton/AuthButton";
import logo from "../../assets/logo.jpeg";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar-contianer">
      <a className="refresh-home nav-item" href="http://localhost:3000/">
        <img src={logo} alt="Some text" width="15%" />
      </a>
      <nav>
        <ul>
          <li>
            <NavLink
              className={(navData) =>
                navData.isActive ? "nav-item-active" : "nav-item"
              }
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) =>
                navData.isActive ? "nav-item-active" : "nav-item"
              }
              to="propose-loan"
            >
              Propose Loan
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) =>
                navData.isActive ? "nav-item-active" : "nav-item"
              }
              to="browse-loans"
            >
              Browse Loans
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) =>
                navData.isActive ? "nav-item-active" : "nav-item"
              }
              to="profile"
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
      <AuthButton />
    </header>
  );
};

export default Navbar;
