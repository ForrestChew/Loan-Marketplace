import { useState, useEffect } from "react";
import { callgetLoanProposals } from "../../contract-info/contract-interactions";
import LoanProposal from "../../components/LoanProposal/LoanProposal";
import "./BrowseLoans.css";

const BrowseLoans = () => {
  const [loanProposals, setLoanProposals] = useState([]);
  const [fractLoans, setFractLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const proposals = await callgetLoanProposals();
      proposals.map((proposal) => {
        const { isProposed, isForSale } = proposal;
        if (isProposed) {
          setLoanProposals((loanProposals) => [...loanProposals, proposal]);
        } else if (isForSale) {
          setFractLoans((fractLoans) => [...fractLoans, setFractLoans]);
        }
      });
    })();
    setIsLoading(false);
  }, []);

  return (
    <>
      {!loanProposals.length && !loanProposals.length && !isLoading && (
        <h1 style={{ color: "white" }}>Test</h1>
      )}
      <section className="proposals">
        {loanProposals.map((proposalAttributes, idx) => {
          return <LoanProposal key={idx} attributes={proposalAttributes} />;
        })}
      </section>
      <section className="fract-loans">
        {fractLoans.map((fractLoan, idx) => {})}
      </section>
    </>
  );
};

export default BrowseLoans;
