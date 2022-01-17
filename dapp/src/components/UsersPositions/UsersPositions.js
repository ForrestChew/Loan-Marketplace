import { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import Web3 from 'web3';
import ABI from '../../ABIs/abi';
import loansAddress from '../../ABIs/address';
import DisplayStrips from '../strips/DisplayStrips';
import '../strips/strips.css'
import './users-positions.css';

const UsersPositions = () => {
    const { Moralis, user, isUnauthenticated, isAuthenticated } = useMoralis(); 
    const hasFetchedData = useRef(false);
    const [userProposals,setUserProposals] = useState([]);
    // Loans that user has filled
    const [userLentLoans,setUserLentLoans] = useState([]);
    // Proposed loans from user that have been filled
    const [userFilledLoans,setUserFilledLoans] = useState([]);
    const [listLoan,setListLoan] = useState({
        percentOfLoan: '', 
        sellingPrice: ''
    });
    //Retrieves the percentage of loan that the lender is selling off.
    //Also retrieves the price they are selling it for and adds it to the display strip.
    const [queriedPercentofLoan,setQueriedPercentOfLoan] = useState('');
    const [queriedSellingPrice,setQueriedSellingPrice] = useState('');

    const handleListLoan = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setListLoan({
            ...listLoan,
            [name]: value,
        });
    }

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
                    const queryProposals = new Moralis.Query('LoanProposals');
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
        const getLoanInfo = {
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'viewActiveLoans',
            params: {
                _lender: userFilledLoans[0].attributes.Lender,
                _borrower: userFilledLoans[0].attributes.Borrower
            }
        }
        // Returns info about specified loan, and calls the payback method within smart contract with said info
        await Moralis.executeFunction(getLoanInfo).then((loanInfo) => {
            const totalAmountBn = Web3.utils.toBN(loanInfo[0])
                .add(Web3.utils.toBN(loanInfo[2]))
                .add(Web3.utils.toBN(loanInfo[7]))
                .toString();
            console.log(Web3.utils.toBN(totalAmountBn));
            console.log(Moralis.Units.FromWei(totalAmountBn));

            const payoffLoan = {
                abi: ABI,
                contractAddress: loansAddress,
                chain: '1337',
                msgValue: Web3.utils.toBN(totalAmountBn),
                functionName: 'payback',
                params: {
                    _lender: userFilledLoans[0].attributes.Lender
                }
            }
            Moralis.executeFunction(payoffLoan)
            .then(() => {
                deleteActiveLoan();
            });
        })
    }
    // Deletes the activated loan from DB
    const deleteActiveLoan = async () => {
        const query = new Moralis.Query('ActivatedLoans');
        const activeLoanQuery = await query.get(userFilledLoans[0].id);
        await activeLoanQuery.destroy();
    }

    // Invoked by the Sell Loan button
    const sellLoan = async (percentOfLoan, sellingPrice) => {
        await Moralis.enableWeb3();
        const listLoan = {
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'listLoan',
            params: {
                _borrower: userLentLoans[0].attributes.Borrower,
                _salePrice: Moralis.Units.ETH(sellingPrice),
                _loanFraction: percentOfLoan
            }
        }
        await Moralis.executeFunction(listLoan);
        updateActiveLoan();
    }

    // Adds fields to Moralis database
    const updateActiveLoan = async () => {
        const query = new Moralis.Query('ActivatedLoans');
        const activeLoanQuery = await query.get(userLentLoans[0].id);
        activeLoanQuery.set('PercentOfLoanSold', listLoan.percentOfLoan);
        activeLoanQuery.set('SellingPrice', listLoan.sellingPrice);
        activeLoanQuery.save().then((console.log("ActiveLoan updated and saved")));
        updateDisplayStrip();
    }

    const updateDisplayStrip = async () => {
        const query = new Moralis.Query("ActivatedLoans");
        const activeLoanQuery = await query.get(userLentLoans[0].id);
        setQueriedPercentOfLoan(activeLoanQuery.attributes.PercentOfLoanSold);
        setQueriedSellingPrice(activeLoanQuery.attributes.SellingPrice);
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
                        <div>
                            <label>Percent of Loan to sell:</label>
                            <input 
                                className='inputs'
                                name='percentOfLoan'
                                value={listLoan.percentOfLoan} 
                                onChange={handleListLoan} />
                            <br></br>
                            <label>Selling Price:</label>
                            <input 
                                className='inputs'
                                name='sellingPrice'
                                value={listLoan.sellingPrice} 
                                onChange={handleListLoan} />
                            <br></br>
                            <button 
                                className='btn general'
                                onClick={() => {
                                    sellLoan(
                                        listLoan.percentOfLoan,
                                        listLoan.sellingPrice
                                    )
                                }}
                            >
                                Sell Loan
                            </button>
                        </div>
                        <DisplayStrips 
                            amount={`Amount Lent: ${Amount} ETH`}
                            interestRate={`Interest Rate: ${InterestRate}%`}
                            duration={`Loan Duration: ${LoanDuration}`}
                            borrower={`Borrower Address: ${Borrower}`}
                            percentSold={`Fraction percent to sell: ${queriedPercentofLoan}`}
                            sellingPrice={`Loan fraction selling price in ETH: ${queriedSellingPrice}`}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default UsersPositions
