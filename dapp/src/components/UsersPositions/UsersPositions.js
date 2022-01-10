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


    useEffect(() => {
        if (isUnauthenticated) {
            setUserProposals([]);
            hasFetchedData.current = false;
            console.log('removed')
        }
    }, [isUnauthenticated]);

    useEffect(() => {
        const getProposedLoan = async () => {
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
                    console.log(activeLoan)
                    setUserActiveLoans(activeLoan);
                    hasFetchedData.current = true;
                }
                catch(err) {
                    console.log(err)
                }
            }
        }
        getProposedLoan();
    }, [Moralis, setUserProposals, isAuthenticated, user]);
    
    return (
        <>
            {!isUnauthenticated ? userProposals.map((proposal) => {
                const { id } = proposal;
                const {Amount, InterestRate, LoanDuration, Borrower } = proposal.attributes;
                return (
                    <div key={id}>
                        <DisplayStrips 
                            amount={Amount}
                            interestRate={InterestRate}
                            duration={LoanDuration}
                            borrower={Borrower}
                        />
                    </div>
                )
            }) : 'Component stating that user has no proposed loans'}
            {!isUnauthenticated ? userActiveLoans.map((activeLoan) => {
                const { id } = activeLoan;
                const {Amount, InterestRate, LoanDuration, Borrower } = activeLoan.attributes;
                return (
                    <div key={id}>
                        <DisplayStrips 
                            amount={Amount}
                            interestRate={InterestRate}
                            duration={LoanDuration}
                            borrower={Borrower}
                        />
                    </div>
                )
            }) : 'Component stating that user has no proposed loans'}
        </>
    )
}

export default UsersPositions
