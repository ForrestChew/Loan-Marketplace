import React from 'react'
import './cards.css'

const Card = ({ amount, interestRate, duration, borrower}) => {
    return (
        <div className='card-container'>
            <li className='card'>
                {amount}
            </li>
            <li className='card'>
                {interestRate}
            </li>
            <li className='card'>
                {duration}
            </li>
            <li className='card'>
                {borrower}
            </li>
            <button className='card' style={{backgroundColor: '#f5f5f5fa'}}>LEND</button>
        </div> 
    )
}

export default Card
