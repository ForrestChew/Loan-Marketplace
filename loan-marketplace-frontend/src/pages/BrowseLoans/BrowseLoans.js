import { useState } from "react";
import { callgetLoanProposals } from "../../contract-info/contract-interactions";
import { useContractEvents } from "../../hooks/useContractEvents";
import LoanProposal from "../../components/LoanProposal/LoanProposal";
import "../PagesGlobal.css";

const BrowseLoans = () => {
  const [loanProposals, setLoanProposals] = useState([]);
  const [fractLoans, setFractLoans] = useState([]);

  const getProposalAndFractLoans = async () => {
    const proposals = await callgetLoanProposals();
    if (!proposals.length) return;
    setLoanProposals([]);
    setFractLoans([]);
    proposals.map((proposal) => {
      const { isProposed, isForSale } = proposal;
      if (isProposed) {
        setLoanProposals((loanProposals) => [...loanProposals, proposal]);
      } else if (isForSale) {
        setFractLoans((fractLoans) => [...fractLoans, setFractLoans]);
      }
    });
  };

  useContractEvents(getProposalAndFractLoans);

  return (
    <div className="page-container">
      <div className="market-item-container">
        <h1 style={{ textAlign: "center" }}>Loan Proposals</h1>
        <section className="market-items">
          {loanProposals.map((proposalAttributes, idx) => {
            return <LoanProposal key={idx} attributes={proposalAttributes} />;
          })}
        </section>
      </div>
      <div className="market-item-container">
        <h1 style={{ textAlign: "center" }}>Fractional Loans</h1>
        <section className="market-items">
          {fractLoans.map((fractLoan, idx) => {})}
        </section>
      </div>
    </div>
  );
};

export default BrowseLoans;
