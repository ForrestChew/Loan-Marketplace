import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthButton from "../../Auth/AuthButton";
import logo from "../../assets/homey.svg";
import { HamburgerContext } from "../../contexts/HamburgerContextProvider";
import hamburger from "../../assets/hamburger-menu-icon.svg";
import "./Navbar.css";

const Navbar = () => {
  const [hamMenuOpen, setHamMenuOpen] = useContext(HamburgerContext);

  const handleHamMenuToggle = () => {
    setHamMenuOpen(!hamMenuOpen);
  };

  const closeHamMenu = () => {
    if (hamMenuOpen) setHamMenuOpen(false);
  };

  const renderClasses = () => {
    let classes = "navlinks";
    if (hamMenuOpen) classes += " active";
    return classes;
  };

  return (
    <>
      <nav>
        <a href="http://localhost:3000/">
          <div className="logo-area">
            <img src={logo} alt="Logo" width="10%" />
            <h4>Loan Marketplace</h4>
          </div>
        </a>
        <ul className={renderClasses()}>
          <li onClick={closeHamMenu}>
            <NavLink
              className={(navData) =>
                navData.isActive ? "link-active" : "link"
              }
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li onClick={closeHamMenu}>
            <NavLink
              className={(navData) =>
                navData.isActive ? "link-active" : "link"
              }
              to="propose-loan"
            >
              Propose Loan
            </NavLink>
          </li>
          <li onClick={closeHamMenu}>
            <NavLink
              className={(navData) =>
                navData.isActive ? "link-active" : "link"
              }
              to="browse-loans"
            >
              Browse Loans
            </NavLink>
          </li>
          <li onClick={closeHamMenu}>
            <NavLink
              className={(navData) =>
                navData.isActive ? "link-active" : "link"
              }
              to="profile"
            >
              Profile
            </NavLink>
          </li>
          <AuthButton />
        </ul>
        <div className="hamburger-toggle" onClick={handleHamMenuToggle}>
          <img src={hamburger} alt="Menu" width="25%" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
