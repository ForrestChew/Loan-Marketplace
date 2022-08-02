import { useState, useEffect } from "react";
import {
  getProvider,
  getContractInstance,
  callgetLoanProposals,
} from "../../contract-info/contract-interactions";
import MillAndHouse from "../../assets/MillAndHouse.Svg";
import "./Home.css";

const Home = () => {
  const [mpInfoCounts, setMPInfoCounts] = useState({
    lenderCnt: 0,
    borrowerCnt: 0,
    proposalCnt: 0,
    loanCnt: 0,
    fractCnt: 0,
  });

  const updateMPInfoCounters = async () => {
    const proposals = await callgetLoanProposals();
    if (!proposals.length) return;
    setMPInfoCounts({
      lenderCnt: 0,
      borrowerCnt: 0,
      proposalCnt: 0,
      loanCnt: 0,
      fractCnt: 0,
    });
    proposals.forEach((proposal) => {
      const { isProposed, isActive, lenders } = proposal;
      switch (true) {
        case isProposed:
          setMPInfoCounts((mpInfoCounts) => ({
            ...mpInfoCounts,
            proposalCnt: mpInfoCounts.proposalCnt + 1,
          }));
          break;
        case isActive:
          setMPInfoCounts((mpInfoCounts) => ({
            ...mpInfoCounts,
            lenderCnt: mpInfoCounts.lenderCnt + 1,
            loanCnt: mpInfoCounts.loanCnt + 1,
            borrowerCnt: mpInfoCounts.borrowerCnt + 1,
          }));
          break;
        case isActive && lenders.length > 1:
          setMPInfoCounts((mpInfoCounts) => ({
            ...mpInfoCounts,
            fractCnt: mpInfoCounts.fractCnt + 1,
          }));
          break;
      }
    });
  };

  useEffect(() => {
    updateMPInfoCounters();
  }, []);

  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("LoanProposalCreated", () => {
      updateMPInfoCounters();
    });
    return () => loanMarketplace.removeListener("LoanProposalCreated");
  }, []);

  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("Lend", () => {
      updateMPInfoCounters();
    });
    return () => loanMarketplace.removeListener("Lend");
  }, []);

  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("DebtPaid", () => {
      updateMPInfoCounters();
    });
    return () => loanMarketplace.removeListener("DebtPaid");
  }, []);

  return (
    <>
      <img className="mill-svg" src={MillAndHouse} />
      <section className="title">
        <h1>
          Loan Marketplace <em>(not predetory)</em>
        </h1>
        <h4>Borrow, lend, and sell debt through this P2P lending protocal.</h4>
        <h4>Your financial future awaits.</h4>
      </section>
      <section className="stats">
        <h1>Active</h1>
        <ul className="stat-items">
          <div className="stat-contents">
            <li>Lenders</li>
            <li>{mpInfoCounts.lenderCnt}</li>
          </div>
          <div className="stat-contents">
            <li>Borrowers</li>
            <li>{mpInfoCounts.borrowerCnt}</li>
          </div>
          <div className="stat-contents">
            <li>Proposals</li>
            <li>{mpInfoCounts.proposalCnt}</li>
          </div>
          <div className="stat-contents">
            <li>Loans</li>
            <li>{mpInfoCounts.loanCnt}</li>
          </div>
          <div className="stat-contents">
            <li>Fractional Loans</li>
            <li>{mpInfoCounts.fractCnt}</li>
          </div>
        </ul>
      </section>
    </>
  );
};

export default Home;
