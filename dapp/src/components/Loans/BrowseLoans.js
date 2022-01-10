import { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import Strip from '../strips/Strip';

const BrowseLoans = () => {
    const { Moralis } = useMoralis();
    const hasFetchedData = useRef(false);
    const [loans,setLoans] = useState([]);

    useEffect(() => {
        const getLoans = async() => {
            if (!hasFetchedData.current) {
                await Moralis.enableWeb3(); 
                const query = new Moralis.Query('Loans');
                const allLoans = await query.find();
                setLoans(allLoans);
                hasFetchedData.current = true;
            }
        }
        getLoans();
    }, [Moralis, loans]);
    return (
        <>
            {loans.map((loan) => {
                const { id } = loan;
                const { Amount, InterestRate, LoanDuration, Borrower } = loan.attributes;
                return (
                    <div key={id}>
                        <Strip 
                            amount={`Asking amount in ETH: ${Amount}`} 
                            interestRate={`Interest Rate: ${InterestRate}%`}
                            duration={`Loan Duration: ${LoanDuration} days`}
                            borrower={`Proposer: ${Borrower}`}
                            id={id}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default BrowseLoans
