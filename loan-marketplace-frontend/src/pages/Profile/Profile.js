import { useEffect, useState } from "react";
import { getSigner } from "../../contract-info/contract-interactions";
import { useContractEvents } from "../../hooks/useContractEvents";
import { callgetLoanProposals } from "../../contract-info/contract-interactions";
import LentLoans from "../../components/LentLoans/LentLoans";
import "../PagesGlobal.css";

const Profile = () => {
  const [loansLentTo, setLoansLentTo] = useState([]);

  const { signerAddress } = getSigner();
  const test = useContractEvents(); // FIX BROWSE LOANS WITH EVENTS USING AN EXPRESSION WITH HOOK INSTEAD OF PASSING CALLBACK

  useEffect(() => {
    const getYourLoans = async () => {
      const proposals = await callgetLoanProposals();
      if (!proposals.length) return;
      proposals.map((proposal) => {
        const { lenders } = proposal;
        if (lenders.length) {
          console.log(proposal);
          setLoansLentTo((loansLentTo) => [...loansLentTo, proposal]);
        }
      });
    };
    getYourLoans();
  }, [test]);

  return (
    <div className="page-container">
      <div className="market-item-container">
        <h1 style={{ textAlign: "center" }}>Loans Lent To</h1>
        <section className="market-items">
          {loansLentTo.map((proposalAttributes, idx) => {
            return <LentLoans key={idx} attributes={proposalAttributes} />;
          })}
        </section>
      </div>
      <div className="market-item-container">
        <h1 style={{ textAlign: "center" }}>Fractional Loans</h1>
        <section className="market-items">
          {/* {fractLoans.map((fractLoan, idx) => {})} */}
        </section>
      </div>
    </div>
  );
};

export default Profile;
