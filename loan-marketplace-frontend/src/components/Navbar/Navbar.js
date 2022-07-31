import { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthButton from "../../Auth/AuthButton";
import logo from "../../assets/homey.svg";
import hamburger from "../../assets/hamburger-menu-icon.svg";
import "./Navbar.css";

const Navbar = () => {
  const [navLinkOpen, setNavLinkOpen] = useState(false);

  const handleNavLinksToggle = () => {
    setNavLinkOpen(!navLinkOpen);
  };

  const renderClasses = () => {
    let classes = "navlinks";
    if (navLinkOpen) classes += " active";
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
          <li onClick={handleNavLinksToggle}>
            <NavLink
              className={(navData) =>
                navData.isActive ? "link-active" : "link"
              }
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li onClick={handleNavLinksToggle}>
            <NavLink
              className={(navData) =>
                navData.isActive ? "link-active" : "link"
              }
              to="propose-loan"
            >
              Propose Loan
            </NavLink>
          </li>
          <li onClick={handleNavLinksToggle}>
            <NavLink
              className={(navData) =>
                navData.isActive ? "link-active" : "link"
              }
              to="browse-loans"
            >
              Browse Loans
            </NavLink>
          </li>
          <li onClick={handleNavLinksToggle}>
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
        <div className="hamburger-toggle" onClick={handleNavLinksToggle}>
          <img src={hamburger} alt="Menu" width="25%" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
