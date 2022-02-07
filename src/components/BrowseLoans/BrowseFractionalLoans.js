/* 
This file queries active loans from the Moralis database that have been listed 
by the lender, and displays them in the "Browse Fractional Loans" tab.
*/
import { useState, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import FractionalStrip from '../strips/FractionalStrip';
const BrowseFractionalLoans = () => {
  const { Moralis } = useMoralis();
  // Defines an array that will be populated with loans that are for sale
  const [loans, setLoans] = useState([]);
  /* 
  The useRef hook is used to prevent an endless loop that would
  otherwise appear from the useEffect.
  */
  const hasFetchedData = useRef(false);
  // Queries active loans that are for sale from Moralis DB
  useEffect(() => {
    const getForSaleLoans = async () => {
      // The if block will only run when useRef is false to prevent endless loop
      if (!hasFetchedData.current) {
        await Moralis.enableWeb3();
        const query = new Moralis.Query('ActivatedLoans');
        const allLoans = await query.find();
        // Only retrieves the fractional loans
        const fractionalLoansIso = allLoans.filter(
          (loan) => loan.attributes.SellingPrice > 0
        );
        // Locks the if block so an enless loop cannot occur
        hasFetchedData.current = true;
        setLoans(fractionalLoansIso);
      }
    };
    getForSaleLoans();
  }, [Moralis]);

  return (
    /* 
    Destructures the loans to retrieve their attributes, then
    passes the attributes as props to the fractional strip component
    to dsiplay.
    */
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
          SellingPrice,
          FractionalBuyersAddr,
        } = loan.attributes;
        return (
          <div key={id}>
            {/* Only displays loans the do not have a fractional buyer, 
            since that means the loan cannot have been sold. */}
            {FractionalBuyersAddr || (
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
            )}
          </div>
        );
      })}
    </>
  );
};

export default BrowseFractionalLoans;
