const DisplayStrips = ({ amount, interestRate, duration, borrower }) => {
    return (
        <div className='strip-container'>
            <li className='strip'>
                {amount}
            </li>
            <li className='strip'>
                {interestRate}
            </li>
            <li className='strip'>
                {duration}
            </li>
            <li className='strip'>
                {borrower}
            </li>
        </div> 
    )
}

export default DisplayStrips