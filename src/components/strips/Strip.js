import { useMoralis } from 'react-moralis';
import ABI from '../../ContractInfo/abi';
import loansAddress from '../../ContractInfo/address';
import '../../styles/strips.css';

const Strip = ({ amount, interestRate, duration, borrower, id, interestAmount }) => {
    const { Moralis, user, isUnauthenticated } = useMoralis();

    const lend = async () => {
        try {
        const borrowerAddr = borrower.substring(10);
        if (!isUnauthenticated && borrowerAddr !== user.get('ethAddress')) {
            const ethToSend = amount.substring(21);
            const amountStringToNum = parseFloat(ethToSend);
            const ethInWei = Moralis.Units.ETH(amountStringToNum);
            const fillLoan = {
                abi: ABI,
                contractAddress: loansAddress,
                chain: '1337',
                functionName: 'lend',
                msgValue: ethInWei,
                params: {
                    _borrower: borrowerAddr 
                }
            }
            await Moralis.executeFunction(fillLoan);
            // Invokes function to create the Activated Loan in database
            await createLend();
        } else {
            alert('Please login')
        }
        } catch(err) {
            alert('Please refresh the page and login');
        }
    }

    const createLend = async () => {
        const ActivatedLoan = Moralis.Object.extend('ActivatedLoans');
        const borrowerAddr = borrower.substring(10);
        const ethToSend = amount.substring(21);
        /*Isolates the interest rate string to just the interest rate  
        number before inputing the number into the database*/
        const iRateArray = interestRate.split(' ');
        const iRateIndexIso = iRateArray[2];
        const iRateNumIso = iRateIndexIso.slice(0,-1);
        /*Isolates the duration string to just the duration number
        before inputing the number into the database*/
        const durationArray = duration.split(' ');
        const durationIndexIso = durationArray[2];
        //Creates new Active Loan object
        const newAL = new ActivatedLoan();
        //newAL is an alias for newActivatedLoan
        newAL.set('Amount', ethToSend);
        newAL.set('InterestRate', iRateNumIso); 
        newAL.set('LoanDuration', durationIndexIso);
        newAL.set('Borrower', borrowerAddr);
        newAL.set('InterestRateAmount', parseFloat(interestAmount));
        newAL.set('Lender', user.get('ethAddress'));
        console.log(interestAmount);
        await newAL.save();
        deleteLoanProposal()
    }
    //Loan proposal deleted when user fills that proposal.
    //The loan proposal will become an "ActivatedLoan" in the Moralis DB
    const deleteLoanProposal = async () => {
        const query = new Moralis.Query('LoanProposals');   
        const loanToDestroy = await query.get(id);
        loanToDestroy.destroy();
    } 

    return (
        <div className="strip-container"
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
            <button 
                className="btn" 
                onClick={() => lend()}
            >
                LEND
            </button>
        </div> 
    )
}

export default Strip
