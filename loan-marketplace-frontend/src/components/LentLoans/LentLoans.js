import { ethers } from "ethers";
import { invokeSellLoanFraction } from "../../contract-info/contract-interactions";
/// loanId, price, percentage

const LentLoans = ({ attributes }) => {
  const { id, loanAmount, interestRate, loanDuration, borrower } = attributes;

  const sellLoanFraction = async () => {
    await invokeSellLoanFraction(id);
  };
  return (
    <>
      <section className="proposal-container">
        <table>
          <thead>
            <tr>
              <th>Amount Lent</th>
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
        <button className="lend-btn" onClick={sellLoanFraction}>
          Sell
        </button>
      </section>
    </>
  );
};

export default LentLoans;
