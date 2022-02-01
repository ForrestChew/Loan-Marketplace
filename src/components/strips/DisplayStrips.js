const DisplayStrips = ({ 
    amount, 
    interestRate, 
    duration, 
    borrower, 
    lender, 
    percentSold, 
    sellingPrice,
}) => {
    return (
        <div 
            className="strip-container"
            style={{border: '6px solid gray'}}
        >
            <li className="strip">
                {amount}
            </li>
            <li className="strip">
                {interestRate}
            </li>
            <li className="strip">
                {duration}
            </li>
            <li className="strip">
                {borrower}
            </li>
            <li className="strip">
                {lender}
            </li>
            <li className="strip">
                {percentSold}
            </li>
            <li className="strip">
                {sellingPrice}
            </li>
        </div> 
    )
}

export default DisplayStrips