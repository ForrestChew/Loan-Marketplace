import { useState } from "react";
import { ethers } from "ethers";
import { invokeProposeLoan } from "../../contract-info/contract-interactions";
import "./ProposeLoan.css";

const ProposeLoan = () => {
  const [loanProposal, setLoanProposal] = useState({
    amount: 0,
    rate: 0,
    duration: 0,
  });

  const submitForm = async (e) => {
    e.preventDefault();
    const loanAmountToWei = ethers.utils.parseEther(loanProposal.amount);
    await invokeProposeLoan(
      loanAmountToWei,
      loanProposal.rate,
      loanProposal.duration
    );
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setLoanProposal({ ...loanProposal, [name]: value });
  };

  return (
    <section className="form-container">
      <form className="propose-loan-form" onSubmit={submitForm}>
        <h2>Propose Loan</h2>
        <label>Loan Amount</label>
        <input
          type="number"
          name="amount"
          value={loanProposal.amount}
          placeholder="To Borrow"
          min="0"
          required
          onChange={handleInputChange}
        ></input>
        <label>Interest Rate</label>
        <input
          type="number"
          name="rate"
          value={loanProposal.rate}
          placeholder="Interest Rate Percent"
          min="0"
          required
          onChange={handleInputChange}
        ></input>
        <label>Duration</label>
        <input
          type="number"
          name="duration"
          value={loanProposal.duration}
          placeholder="Loan Duration"
          min="0"
          required
          onChange={handleInputChange}
        ></input>
        <button className="propose-btn">Propose</button>
      </form>
    </section>
  );
};

export default ProposeLoan;
