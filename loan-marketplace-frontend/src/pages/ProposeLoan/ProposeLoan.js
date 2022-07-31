import "./ProposeLoan.css";

const ProposeLoan = () => {
  return (
    <section className="form-container">
      <form className="propose-loan-form">
        <h2>Propose Loan</h2>
        <label>Loan Amount</label>
        <input
          type="number"
          name="amount"
          placeholder="To Borrow"
          min="0"
          required
        ></input>
        <label>Interest Rate</label>
        <input
          type="number"
          name="iRate"
          placeholder="Interest Rate Percent"
          min="0"
          required
        ></input>
        <label>Duration</label>
        <input
          type="number"
          name="duration"
          placeholder="Loan Duration"
          min="0"
          required
        ></input>
        <button>Propose</button>
      </form>
    </section>
  );
};

export default ProposeLoan;
