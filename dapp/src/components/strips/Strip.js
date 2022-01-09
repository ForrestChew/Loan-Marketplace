import { useMoralis } from 'react-moralis';
import ABI from '../../ABIs/abi';
import loansAddress from '../../ABIs/address';
import './strips.css';

const Strip = ({ amount, interestRate, duration, borrower, id}) => {
    const { Moralis, user } = useMoralis();
    const lend = async () => {
        const borrowerAddr = borrower.substring(10);
        const ethToSend = amount.substring(21);
        const fillLoan = {
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'lend',
            msgValue: ethToSend,
            params: {
                _borrower: borrowerAddr 
            }
        }
        await Moralis.executeFunction(fillLoan);
        await createLend();
    }

    const createLend = async () => {
        const ActivatedLoan = Moralis.Object.extend('ActivatedLoans');
        //newAL is an alias for newActivatedLoan
        const newAL = new ActivatedLoan();
        newAL.set('amount', amount);
        newAL.set('InterestRate', interestRate);
        newAL.set('LoanDuration', duration)
        newAL.set('Borrower', borrower);
        newAL.set('Lender', user.get('ethAddress'));
        await newAL.save();
        deleteLoanProposal()
    }
    //Loan proposal deleted when user fills that proposal.
    //The loan proposal will become an "Activated Loan" in Moralis DB
    const deleteLoanProposal = async () => {
        const query = new Moralis.Query('Loans');   
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
                style={{backgroundColor: '#f5f5f5fa'}}
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
