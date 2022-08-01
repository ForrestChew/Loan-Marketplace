import { useState, useEffect } from "react";
import { callgetLoanProposals } from "../../contract-info/contract-interactions";
import LoanProposal from "../../components/LoanProposal/LoanProposal";
import "./BrowseLoans.css";

const BrowseLoans = () => {
  const [loanProposals, setLoanProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLoanProposals = async () => {
      const proposals = await callgetLoanProposals();
      proposals.map((proposal) => {
        setLoanProposals((loanProposals) => [...loanProposals, proposal]);
      });
    };
    getLoanProposals();
    setIsLoading(false);
  }, []);

  return (
    <section className="proposals">
      {isLoading ? (
        <h1>LOADING...</h1>
      ) : (
        loanProposals.map((proposalAttributes, idx) => {
          if (proposalAttributes.lenders.length == 0)
            return <LoanProposal key={idx} attributes={proposalAttributes} />;
        })
      )}
    </section>
  );
};

export default BrowseLoans;
