import { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import FractionalStrip from '../strips/FractionalStrip';
const BrowseFractionalLoans = () => {
    const { Moralis } = useMoralis();
    const [loans,setLoans] = useState([]);
    const hasFetchedData = useRef(false);

    useEffect(() => {
        const getForSaleLoans = async () => {
            if (!hasFetchedData.current) {
                await Moralis.enableWeb3();
                // Loops through active loans to find loans for sale
                const query = new Moralis.Query('ActivatedLoans');
                const allLoans = await query.find();
                allLoans.forEach((loan) => {
                    if (loan.attributes.SellingPrice !== undefined && 
                        loan.attributes.FractionalBuyersAddr === undefined) {
                        setLoans(allLoans);
                    }
                });
            hasFetchedData.current = true;
            }
        }
        getForSaleLoans()
    }, [Moralis, loans]);    
    
    return (
        <>
            {loans.map((loan) => {
                const { id } = loan;
                const { 
                    Amount, 
                    InterestRate, 
                    LoanDuration, 
                    Borrower, 
                    InterestRateAmount, 
                    Lender,
                    PercentOfLoanSold, 
                    SellingPrice 
                } = loan.attributes;
                return (
                    <div key={id}>
                        <FractionalStrip 
                            amount={`Asking amount in ETH: ${Amount}`} 
                            interestRate={`Interest Rate: ${InterestRate}%`}
                            duration={`Loan Duration: ${LoanDuration} days`}
                            borrower={`Borrower: ${Borrower}`}
                            lender={`Lender: ${Lender}`}
                            interestAmount={`Interest Amount in ETH: ${InterestRateAmount}`}
                            percentSold={`Percent of loan for sale: ${PercentOfLoanSold}`}
                            sellingPrice={`Price to buy in ETH: ${SellingPrice}`}
                            id={id}
                        />
                    </div>
                )
            })}            
        </>
    )
}

export default BrowseFractionalLoans
