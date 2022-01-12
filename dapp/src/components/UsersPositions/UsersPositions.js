import { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import DisplayStrips from '../strips/DisplayStrips';
import '../strips/strips.css'
import './users-positions.css';

const UsersPositions = () => {
    const { Moralis, user, isUnauthenticated, isAuthenticated } = useMoralis(); 
    const [userProposals,setUserProposals] = useState([]);
    const [userActiveLoans,setUserActiveLoans] = useState([]);
    const hasFetchedData = useRef(false);

    /* Removes the loan positions for an account when the user logs
    out by setting the state values back to an empty array */
    useEffect(() => {
        if (isUnauthenticated) {
            setUserProposals([]);
            setUserActiveLoans([]);
            hasFetchedData.current = false;
            console.log('removed')
        }
    }, [isUnauthenticated]);

    //Fetches logged in users loan positions from Moralis DB on render
    useEffect(() => {
        const getAccountPositions = async () => {
            if (!hasFetchedData.current) {
                try {
                    await Moralis.enableWeb3();
                    const queryProposals = new Moralis.Query('Loans');
                    const queryProposalsMatch = queryProposals.equalTo('Borrower', user.get('ethAddress'));
                    const proposedLoan = await queryProposalsMatch.find();
                    setUserProposals(proposedLoan);
                    const queryActiveLoans = new Moralis.Query('ActivatedLoans');
                    const queryActiveLoansMatch = queryActiveLoans.equalTo('Lender', user.get('ethAddress'));
                    const activeLoan = await queryActiveLoansMatch.find();
                    setUserActiveLoans(activeLoan);
                    hasFetchedData.current = true;
                }
                catch(err) {
                    console.log(err)
                }
            }
        }
        getAccountPositions();
    }, [Moralis, setUserProposals, isAuthenticated, user]);
    
    return (
        <>
        {/* Displays the loan proposed by logged in account*/}
            {userProposals.map((proposal) => {
                const { id } = proposal;
                const {Amount, InterestRate, LoanDuration, Borrower } = proposal.attributes;
                return (
                    <div key={id}>
                        <h1 style={{color: 'white'}}>Proposed</h1>
                        <DisplayStrips 
                            amount={`Amount Proposed: ${Amount}`}
                            interestRate={`Interest Rate to Pay: ${InterestRate}`}
                            duration={`Loan Duration: ${LoanDuration} days`}
                            borrower={`Your address: ${Borrower}`}
                        />
                    </div>
                )
            })}
            {/* Displays loan that the currently logged in account has lent on */}
            {userActiveLoans.map((activeLoan) => {
                const { id } = activeLoan;
                const {Amount, InterestRate, LoanDuration, Borrower } = activeLoan.attributes;
                return (
                    <div key={id}>
                        <h1 style={{color: 'white'}}>Lent</h1>
                        <DisplayStrips 
                            amount={`Amount Lent: ${Amount} ETH`}
                            interestRate={`Interest Rate: ${InterestRate}%`}
                            duration={`Loan Duration ${LoanDuration}`}
                            borrower={`Borrower Address: ${Borrower}`}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default UsersPositions
