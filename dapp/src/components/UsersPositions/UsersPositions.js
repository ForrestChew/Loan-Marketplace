import { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import ABI from '../../ABIs/abi';
import loansAddress from '../../ABIs/address';
import DisplayStrips from '../strips/DisplayStrips';
import '../strips/strips.css'
import './users-positions.css';

const UsersPositions = () => {
    const { Moralis, user, isUnauthenticated, isAuthenticated } = useMoralis(); 
    const [userProposals,setUserProposals] = useState([]);
    const [userLentLoans,setUserLentLoans] = useState([]);
    const [userFilledLoans,setUserFilledLoans] = useState([]);
    const hasFetchedData = useRef(false);

    /* Removes the loan positions for an account when the user logs
    out by setting the state values back to an empty array */
    useEffect(() => {
        if (isUnauthenticated) {
            setUserProposals([]);
            setUserLentLoans([]);
            setUserFilledLoans([]);
            hasFetchedData.current = false;
        }
    }, [isUnauthenticated]);

    //Fetches logged in users loan positions from Moralis DB on render
    useEffect(() => {
        const getAccountPositions = async () => {
            if (!hasFetchedData.current) {
                try {
                    await Moralis.enableWeb3();
                    // Querys user's loan proposal
                    const queryProposals = new Moralis.Query('Loans');
                    const queryProposalsMatch = queryProposals.equalTo('Borrower', user.get('ethAddress'));
                    const proposedLoan = await queryProposalsMatch.find();
                    // Querys loan that user has lent to
                    const queryActiveLentLoans = new Moralis.Query('ActivatedLoans');
                    const queryActiveLentLoansMatch = 
                    queryActiveLentLoans.equalTo('Lender', user.get('ethAddress'));
                    const lentLoans = await queryActiveLentLoansMatch.find();
                    // Querys users's loan that has been lent to
                    const queryActiveFilledLoan = new Moralis.Query('ActivatedLoans');
                    const queryActiveFilledLoansMatch = 
                    queryActiveFilledLoan.equalTo('Borrower', user.get('ethAddress'));
                    const filledLoan = await queryActiveFilledLoansMatch.find();
                    //Sets state variables with fetched info
                    setUserProposals(proposedLoan);
                    setUserLentLoans(lentLoans);
                    setUserFilledLoans(filledLoan);
                    hasFetchedData.current = true;
                }
                catch(err) {
                    console.log(err)
                }
            }
        }
        getAccountPositions();
    }, [Moralis, setUserProposals, userFilledLoans, isAuthenticated, user]);
    
    const paybackLoan = async () => {
        await Moralis.enableWeb3();
        const iRateAmtToNum = parseFloat(userFilledLoans[0].attributes.InterestRateAmount);
        console.log(`Interest rate amount: ${iRateAmtToNum}`)
        const amountToNum = parseFloat(userFilledLoans[0].attributes.Amount);
        console.log(`Initial debt ${amountToNum}`); 
        const totalDebtToWei = Moralis.Units.ETH(
            iRateAmtToNum + amountToNum
        );
        const payoffLoan = {
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            msgValue: totalDebtToWei,
            functionName: 'payback',
            params: {
                _lender: userFilledLoans[0].attributes.Lender
            }
        }
        await Moralis.executeFunction(payoffLoan);
        deleteActiveLoan();
    }
    // Deletes the activated loan from DB
    const deleteActiveLoan = async () => {
        const query = new Moralis.Query('ActivatedLoans');
        const activeLoanQuery = await query.get(userFilledLoans[0].id);
        console.log(activeLoanQuery)
        await activeLoanQuery.destroy();
    }

    return (
        <>
        {/* Displays the loan proposed by user*/}
            {userProposals.map((proposal) => {
                const { id } = proposal;
                const {Amount, InterestRate, LoanDuration, Borrower } = proposal.attributes;
                return (
                    <div key={id}>
                        <h1 className='general' style={{color: 'white'}}>Proposed</h1>
                        <DisplayStrips 
                            amount={`Amount Proposed: ${Amount}`}
                            interestRate={`Interest Rate to Pay: ${InterestRate}`}
                            duration={`Loan Duration: ${LoanDuration} days`}
                            borrower={`Your address: ${Borrower}`}
                        />
                    </div>
                )
            })}
            {/* Displays users filled loan proposal */}
            {userFilledLoans.map((filledLoan) => {
                const { id } = filledLoan;
                const { Amount, InterestRate, LoanDuration, Lender} = filledLoan.attributes;
                return (
                    <div key={id}>
                        <h1 className='general' style={{color: 'white'}}>Debt</h1>
                        <button className='btn general' onClick={() => paybackLoan()}>Payback</button>
                        <DisplayStrips
                            amount={`Initial Debt: ${Amount}`}
                            interestRate={`Interest Rate: ${InterestRate}`}
                            duration={`Loan Duration: ${LoanDuration} days`}
                            lender={`Loan filled by: ${Lender}`}
                        />
                    </div>
                )
            })}
            {/* Displays the loan that user has lent on */}
            {userLentLoans.map((lentLoan) => {
                const { id } = lentLoan;
                const {Amount, InterestRate, LoanDuration, Borrower } = lentLoan.attributes;
                return (
                    <div key={id}>
                        <h1 className='general' style={{color: 'white'}}>Lent</h1>
                        <button className='btn general'>Sell Loan</button>
                        <DisplayStrips 
                            amount={`Amount Lent: ${Amount} ETH`}
                            interestRate={`Interest Rate: ${InterestRate}%`}
                            duration={`Loan Duration: ${LoanDuration}`}
                            borrower={`Borrower Address: ${Borrower}`}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default UsersPositions
