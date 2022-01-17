import { useMoralis } from 'react-moralis';
import ABI from '../../ABIs/abi';
import loansAddress from '../../ABIs/address';
import './strips.css';

const Strip = ({ amount, interestRate, duration, borrower, id, interestAmount }) => {
    const { Moralis, user } = useMoralis();
    const lend = async () => {
        const borrowerAddr = borrower.substring(10);
        const ethToSend = amount.substring(21);
        const amountStringToNum = parseInt(ethToSend);
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
        await createLend();
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
            <button 
                className='strip' 
                style={{backgroundColor: '#f5f5f5fa', border: 'solid 2px'}}
                onClick={() => {
                    lend();
                }}
            >
                LEND
            </button>
        </div> 
    )
}

export default Strip
