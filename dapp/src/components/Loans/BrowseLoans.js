import { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import Card from '../cards/Card';

const BrowseLoans = () => {
    const { Moralis } = useMoralis();
    const hasFetchedData = useRef(false);
    const [loans,setLoans] = useState([]);

    useEffect(() => {
        const getLoans = async() => {
            if (!hasFetchedData.current) {
                await Moralis.enableWeb3(); 
                const query = new Moralis.Query('Loan');
                const allLoans = await query.find();
                setLoans(allLoans);
                hasFetchedData.current = true;
            }
        }
        getLoans();
        console.log(loans);
    }, [Moralis, loans]);
    return (
        <>
            {loans.map((loan) => {
                const { id } = loan;
                const { Amount, InterestRate, LoanDuration, Borrower } = loan.attributes;
                return (
                    <div key={id}>
                        <Card 
                        amount={`Asking amount in ETH: ${Amount}`} 
                        interestRate={`Interest Rate: ${InterestRate}%`}
                        duration={`Loan Duration: ${LoanDuration} days`}
                        borrower={`Proposer: ${Borrower}`}/>
                    </div>
                )
            })}
        </>
    )
}

export default BrowseLoans
