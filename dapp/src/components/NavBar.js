import React from 'react'
import { useMoralis } from 'react-moralis';

const NavBar = () => {
    const {authenticate} = useMoralis()


    return (
        <nav>
            <ul className='navbar'>
                <li className='list-item'>ABOUT</li>
                <li className='list-item'>PROPOSE LOAN</li>
                <li className='list-item'>BROWSE LOAN</li>
                <li className='list-item'>LEND</li>
                <li 
                className='list-item'
                onClick={() => {authenticate()}} 
                style={{
                    float: 'right', 
                    border: 'solid 3.5px white'}}>
                    Crypto Login
                </li>
            </ul>
        </nav>
    )
}

export default NavBar
