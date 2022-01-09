import { useMoralis } from 'react-moralis';
import { useState } from 'react';
import ABI from '../../ABIs/abi';
import loansAddress from '../../ABIs/address';
import './propose_loan.css';
import '../../index.css';

const ProposeLoan = () => {
    const { Moralis, user } = useMoralis();
    const [loan, setLoan] = useState({
        amount: '',
        interestRate: '',
        loanDuration: '' ,
        borrower: ''
    });
    
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setLoan({...loan, [name]: value, borrower: user.get('ethAddress')}) 
    }
    
    const proposeLoan = async (proposalAmount, interestRatePercentage, loanDuration) => {
        await Moralis.enableWeb3();
        const proposeLoan = { 
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'proposeLoan',
            params: {
                _amount: proposalAmount,
                _interesetRatePercent: interestRatePercentage,
                _duration: loanDuration
            }
        }
        await Moralis.executeFunction(proposeLoan);
        await createLoan();
    }
    const createLoan = async () => {
        const Loan = Moralis.Object.extend("Loans");   
        const newLoan = new Loan();
        newLoan.set('Amount', loan.amount);
        newLoan.set('InterestRate', loan.interestRate);
        newLoan.set('LoanDuration', loan.loanDuration);
        newLoan.set('Borrower', loan.borrower);
        await newLoan.save();
    }
    return (
        <>
            <article className='form'>
                <div className='form-control'>
                    <label>Ask Amount</label>
                    <input 
                        type="text" 
                        name='amount'
                        value={loan.amount} 
                        onChange={handleChange}
                    />
                </div>
                <div className='form-control'>
                    <label>Interest Rate</label>
                    <input 
                        type="text" 
                        name='interestRate'
                        value={loan.interestRate} 
                        onChange={handleChange} />
                </div>
                <div className='form-control'>
                    <label>Duration</label>
                    <input 
                        type="text" 
                        name='loanDuration'
                        value={loan.loanDuration} 
                        onChange={handleChange} />
                </div>
                <button 
                    className='btn submit' 
                    style={{letterSpacing: '2.5px'}}
                    onClick={() => proposeLoan(
                        loan.amount, loan.interestRate, loan.loanDuration
                    )}
                    >
                        Submit
                </button>
            </article>
        </>
    )
}

export default ProposeLoan  
