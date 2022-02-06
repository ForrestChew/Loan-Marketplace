/* 
This file queries loan proposals from Moralis database, 
and displays them in the "Browse Loans" tab.
*/
import { useState, useEffect, useRef } from "react";
import { useMoralis } from "react-moralis";
import Strip from "../strips/Strip";

const BrowseLoans = () => {
  const { Moralis } = useMoralis();
  // Defines array that will be populated with loan proposals
  const [loans, setLoans] = useState([]);
  /* 
  The useRef hook is used to prevent an endless loop that would
  otherwise appear from the useEffect.
  */
  const hasFetchedData = useRef(false);
  // Queries loan proposals from Moralis DB
  useEffect(() => {
    const getLoans = async () => {
      // The if block will only run when useRef is false to prevent endless loop
      if (!hasFetchedData.current) {
        await Moralis.enableWeb3();
        // Queries all the loan proposals from Moralis DB
        const query = new Moralis.Query("LoanProposals");
        const allLoans = await query.find();
        setLoans(allLoans);
        hasFetchedData.current = true;
      }
    };
    getLoans();
  }, [Moralis]);

  return (
    /* 
    Destructures the loan objects and passes the necessary 
    attributes as properties to the Strip component.
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
        } = loan.attributes;
        return (
          <div key={id}>
            <Strip
              amount={`Asking amount in ETH: ${Amount}`}
              interestRate={`Interest Rate: ${InterestRate}%`}
              duration={`Loan Duration: ${LoanDuration} days`}
              borrower={`Proposer: ${Borrower}`}
              interestAmount={InterestRateAmount}
              id={id}
            />
          </div>
        );
      })}
    </>
  );
};

export default BrowseLoans;
