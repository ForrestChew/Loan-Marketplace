import { ethers } from "ethers";
import { invokeLend } from "../../contract-info/contract-interactions";
import "./LoanProposal.css";

const LoanProposal = ({ attributes }) => {
  const { id, loanAmount, interestRate, loanDuration, borrower } = attributes;

  const lend = async () => {
    await invokeLend(id, Number(loanAmount).toString());
  };

  return (
    <section className="proposal-container">
      <table>
        <thead>
          <tr>
            <th>Loan Amount</th>
            <th>Interest Rate</th>
            <th>Loan Duration</th>
            <th>Borrower</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ethers.utils.formatEther(loanAmount)}</td>
            <td>{Number(interestRate)}%</td>
            <td>{Number(loanDuration)} Days</td>
            <td>{borrower} </td>
          </tr>
        </tbody>
      </table>
      <button className="lend-btn" onClick={lend}>
        Lend
      </button>
    </section>
  );
};

export default LoanProposal;
