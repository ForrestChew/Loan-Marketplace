import React from 'react'
import { useMoralis } from 'react-moralis';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    const {authenticate} = useMoralis()
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
                <div 
                className='list-item'
                onClick={() => authenticate()} 
                style={{
                    display: 'block',
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'impact',
                    fontSize: '28px',
                    letterSpacing: '2px',
                    padding: '30px 30px',
                    textDecoration: 'none',
                    float: 'right', 
                    border: 'solid 3.5px white'}}
                >
                    Crypto Login
                </div>
        </nav>
    )
}

export default NavBar
