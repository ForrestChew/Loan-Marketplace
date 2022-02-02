import { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import Web3 from 'web3';
import ABI from '../ContractInfo/abi';
import loansAddress from '../ContractInfo/address';
import DisplayStrips from './strips/DisplayStrips';
import '../styles/strips.css'
import '../styles/users-positions.css';

const UsersPositions = () => {
    const { Moralis, user, isUnauthenticated, isAuthenticated } = useMoralis(); 
    const hasFetchedData = useRef(false);
    const [userProposals,setUserProposals] = useState([]);
    // Loans that user has filled
    const [userLentLoans,setUserLentLoans] = useState([]);
    // Proposed loans from user that have been filled
    const [userFilledLoans,setUserFilledLoans] = useState([]);
    const [userBoughtLoans,setUserBoughtLoans] = useState([]);
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
            setUserBoughtLoans([]);
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
                    // Querys loan if bought by the current user
                    const boughtLoans = new Moralis.Query('ActivatedLoans');
                    const boughtLoansByAddr = boughtLoans.equalTo('FractionalBuyersAddr', user.get('ethAddress'));
                    const boughtLoan = await boughtLoansByAddr.find(); 
                    // Sets state variables with fetched info
                    setUserProposals(proposedLoan);
                    setUserLentLoans(lentLoans);
                    setUserFilledLoans(filledLoan);
                    setUserBoughtLoans(boughtLoan);
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
            let totalAmountBn = '';
            // Determines whether this is a fractional loan or not by the address field queried from 
            //smart contract. If it is, the if block runs, if not, than the else block runs
            if (loanInfo[8] !== '0x0000000000000000000000000000000000000000') {
                totalAmountBn = Web3.utils.toBN(loanInfo[0])
                    .add(Web3.utils.toBN(loanInfo[7])).toString();
            } else {
                totalAmountBn = Web3.utils.toBN(loanInfo[0])
                .add(Web3.utils.toBN(loanInfo[2])).toString();
            }
            // Builds pay off loan object to use in function call
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

    // Lists the loan for sale.
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
    // Updatas active loan fields with the fractional loan listing info
    const updateActiveLoan = async () => {
        const query = new Moralis.Query('ActivatedLoans');
        const activeLoanQuery = await query.get(userLentLoans[0].id);
        activeLoanQuery.set('PercentOfLoanSold', listLoan.percentOfLoan);
        activeLoanQuery.set('SellingPrice', listLoan.sellingPrice);
        await activeLoanQuery.save();
        updateDisplayStrip();
    }
    //Updates the loan state variables in order to update the loan strips
    const updateDisplayStrip = async () => {
        const query = new Moralis.Query("ActivatedLoans");
        const activeLoanQuery = await query.get(userLentLoans[0].id);
        setQueriedPercentOfLoan(activeLoanQuery.attributes.PercentOfLoanSold);
        setQueriedSellingPrice(activeLoanQuery.attributes.SellingPrice);
    }
    // Deletes the user's loan proposal from blockchain and then calls a
    // function to delete the proposal from Moralis database
    const deleteLoanProposalFromChain = async () => {
        const deleteProposalOptions = {
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'deleteLoanProposal'
        }
        await Moralis.executeFunction(deleteProposalOptions);
        // Calls function to delete loan proposal from database
        deleteLoanProposalFromDatabase();
    }
    // Deletes loan proposal from database
    const deleteLoanProposalFromDatabase = async () => {
        const query = new Moralis.Query('LoanProposals');
        // References the user's loan proposal
        const proposalToDelete = await query.get(userProposals[0].id);
        await proposalToDelete.destroy();
    }

    return (
        <>
        {/* Displays the loan proposed by user*/}
            {userProposals.map((proposal) => {
                const { id } = proposal;
                const {Amount, InterestRate, LoanDuration, Borrower } = proposal.attributes;
                return (
                    <div key={id} >
                        <h1 className='general'>Proposed</h1>
                        <button
                            className="btn"
                            style={{marginLeft: '14px'}}
                            onClick={() => 
                                deleteLoanProposalFromChain()}
                        >
                            Delete Proposal
                        </button>
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
                    <div key={id} >
                        <h1 className='general'>Debt</h1>
                        <button 
                            className='btn'
                            style={{marginLeft: '14px'}} 
                            onClick={() => 
                                paybackLoan()}
                        >
                            Payback
                        </button>
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
                        <h1 className='general'>Lent</h1>
                        <div>
                            <label className='label'>Fractional Percent:</label>
                            <input 
                                className='inputs'
                                name='percentOfLoan'
                                value={listLoan.percentOfLoan} 
                                onChange={handleListLoan} />
                            <br></br>
                            <label  className='label'>Selling Price:</label>
                            <input 
                                className='inputs'
                                name='sellingPrice'
                                value={listLoan.sellingPrice} 
                                onChange={handleListLoan} />
                            <br></br>
                            <button 
                                className='btn'
                                style={{marginLeft: '14px'}}
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
            {userBoughtLoans.map((boutghtLoan) => {
                const { id } = boutghtLoan;
                const { 
                    PercentOfLoanSold,
                    SellingPrice,
                    FractionalAmount 
                } = boutghtLoan.attributes;
                return (
                    <div key={id}>
                    <h1 className='general'>Loan Fractions Owned</h1>
                        <DisplayStrips 
                            percentSold={`Percent of original loan owned: ${PercentOfLoanSold}%`}
                            amount={`ETH to recieve: ${FractionalAmount}`}
                            sellingPrice={`Bought for: ${SellingPrice} ETH`}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default UsersPositions