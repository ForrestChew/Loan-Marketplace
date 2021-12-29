import { Moralis } from 'moralis';
import { useState } from 'react';
import proposeLoanForm from '../utility/proposeLoanForm';

const Buttons = () => {
    const cryptoLogin = () => {
        Moralis.authenticate().then(function (user) {
            console.log(user.get('ethAddress'))
        })
    }
    
    const [loanForm, setLoanForm] = useState(null);
    const proposeLoan = () => {
        if (loanForm === null) {
            setLoanForm(proposeLoanForm)
            console.log(loanForm)
        } else {
            setLoanForm(null)
            console.log(loanForm)
        }
    }

    const browseLoans = () => {
        console.log("Browse loans button works")
    }

    return (
        <>
            <div className='buttons'>
                <button className='button' onClick={browseLoans}>Browse Loans</button>
                <button className='button' onClick={proposeLoan}>Propose a Loan</button>
                <button className='button' onClick={cryptoLogin}>Crypto Login</button>
            </div>
        </>
    )
}

export default Buttons
