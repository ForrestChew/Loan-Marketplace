import { useMoralis } from 'react-moralis';
import { useState } from 'react';
import ABI from '../ContractInfo/abi';
import loansAddress from '../ContractInfo/address';
import '../styles/propose_loan.css';
import '../styles/index.css';
const ProposeLoan = () => {
  const { Moralis, user } = useMoralis();
  const [loan, setLoan] = useState({
    amount: '',
    interestRate: '',
    interestAmount: '',
    loanDuration: '',
    borrower: '',
  });
  const handleProposeLoan = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoan({
      ...loan,
      [name]: value,
      borrower: user.get('ethAddress'),
    });
  };
  //Make proposal on blockchain
  const proposeLoan = async (
    proposalAmount,
    interestRatePercentage,
    loanDuration
  ) => {
    await Moralis.enableWeb3();
    //Converts the amount proposed to wei
    const ethToWei = Moralis.Units.ETH(proposalAmount);
    const proposeLoan = {
      abi: ABI,
      contractAddress: loansAddress,
      chain: '1337',
      functionName: 'proposeLoan',
      params: {
        _amount: ethToWei,
        _interesetRatePercent: interestRatePercentage,
        // Duration Integer will be multiplied by 86400 to find the amount of seconds in a day.
        // The resulting number will be what is ultimately stored on chain.
        _duration: loanDuration,
      },
    };
    await Moralis.executeFunction(proposeLoan);
    await createLoan();
  };
  // Creates loan proposal from the loan proposal info queried from onchain
  const createLoan = async () => {
    await Moralis.enableWeb3();
    const createLoan = {
      abi: ABI,
      contractAddress: loansAddress,
      chain: '1337',
      functionName: 'viewLoanProposals',
      params: {
        _borrower: loan.borrower,
      },
    };
    await Moralis.executeFunction(createLoan).then((tx) => {
      const LoanProposal = Moralis.Object.extend('LoanProposals');
      const newLoan = new LoanProposal();
      // Reads proposed amount from the blockchain and converts the number from wei
      // and converts the number from integer to string for Database to accept.
      const amountNumToString = Moralis.Units.FromWei(tx[0]).toString();
      newLoan.set('Amount', amountNumToString);
      newLoan.set('InterestRate', tx[1]);
      // Reads proposed interest rate from the blockchain and converts the number from wei
      // and converts the number from integer to string for Database to accept.
      const iRateAmountToString = Moralis.Units.FromWei(tx[2]).toString();
      newLoan.set('InterestRateAmount', iRateAmountToString);
      //Converts duration from seconds to days
      const durationFromSecondsToDays = tx[3] / 86400;
      //Converts duration to string in order to set it in the Moralis Database
      newLoan.set('LoanDuration', durationFromSecondsToDays.toString());
      newLoan.set('Borrower', loan.borrower);
      newLoan.save();
    });
  };
  return (
    <>
      <article className="form">
        <div className="form-control">
          <label>ETH to borrow</label>
          <input
            type="text"
            name="amount"
            value={loan.amount}
            onChange={handleProposeLoan}
          />
        </div>
        <div className="form-control">
          <label>Interest Rate Percent</label>
          <input
            type="text"
            name="interestRate"
            value={loan.interestRate}
            onChange={handleProposeLoan}
          />
        </div>
        <div className="form-control">
          <label>Loan Duration in days</label>
          <input
            type="text"
            name="loanDuration"
            value={loan.loanDuration}
            onChange={handleProposeLoan}
          />
        </div>
        <div className="form-control">
          <button
            className="btn"
            style={{ width: '150px', borderRadius: '25px' }}
            onClick={() =>
              proposeLoan(loan.amount, loan.interestRate, loan.loanDuration)
            }
          >
            Submit
          </button>
        </div>
      </article>
    </>
  );
};

export default ProposeLoan;
