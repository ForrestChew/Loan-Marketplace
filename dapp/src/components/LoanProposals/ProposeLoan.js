import { useMoralis } from 'react-moralis';
import { useState } from 'react';
import ABI from '../../ABIs/abi';
import loansAddress from '../../ABIs/address';
import './ProposeLoan.css';
import '../../index.css';

const ProposeLoan = () => {
    const [loan, setLoan] = useState({
        amount: '',
        interestRate: '',
        loanDuration: ''    
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setLoan({...loan, [name]: value}) 
    }

    const { Moralis, user } = useMoralis();
    const borrowers = [];

    const proposeLoan = async (proposalAmount, interestRatePercentage, loanDuration) => {
        console.log('Propose Loan tx begin')
        const web3 = await Moralis.enableWeb3();
        console.log('Web3 instance ititialized')

        const options = { 
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'proposeLoan',
            params: {
                _amount: proposalAmount,
                _interesetRatePercesnt: interestRatePercentage,
                _duration: loanDuration
            }
        }
        console.log('Almost made it')
        const tx = await Moralis.executeFunction(options);
        console.log('Loan Proposed from this address')
        borrowers.push(user.get('ethAddress'));
        console.log(borrowers)
        

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
            </article>
            <button 
                className='btn submit' 
                onSubmit={() => 
                    proposeLoan}
                    >
                        ProposeLoan
            </button>
        </>
    )
}

export default ProposeLoan  
