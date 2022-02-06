import { useMoralis } from "react-moralis";
import abi from "../../ContractInfo/abi";
import loansAddress from "../../ContractInfo/address";
const FractionalStrip = ({
  amount,
  interestRate,
  interestAmount,
  duration,
  borrower,
  lender,
  percentSold,
  sellingPrice,
  id,
}) => {
  const { Moralis, user } = useMoralis();
  // Function that gets invokes on button click.
  const buyFullLoan = async () => {
    await Moralis.enableWeb3();
    /* 
    Isolates and converts the loan fractions selling price from a string to a number.
    Then, it converts floating point number to wei to be used in onchain function call.
    */
    const sellingPriceIso = sellingPrice.substring(21);
    const sellingPriceIsoToNum = parseFloat(sellingPriceIso);
    const ethInWei = Moralis.Units.ETH(sellingPriceIsoToNum);
    /* 
    Splits borrower's and lender's address propoerty into string arrays in 
    order to isolate both addresses. The addresses are then refrenced by 
    their index and passed as parameters to smart contract. 
    */
    const borrowerAddr = borrower.split(" ");
    const lenderAddr = lender.split(" ");
    // Defines function call object to smart contract.
    const buyFullLoan = {
      abi,
      contractAddress: loansAddress,
      chain: "1337",
      functionName: "buyLoan",
      msgValue: ethInWei,
      params: {
        _lender: lenderAddr[1],
        _borrower: borrowerAddr[1],
      },
    };
    await Moralis.executeFunction(buyFullLoan);
    /* 
    Since this function is only ran if lender is selling 100%
    of the loan, the "Lender" field in database will update with the 
    third party buyer's address, and will reset loan fraction fields back to undefined
    */
    const query = new Moralis.Query("ActivatedLoans");
    const queryToUpdate = await query.get(id);
    queryToUpdate.set("Lender", user.get("ethAddress"));
    queryToUpdate.set("PercentOfLoanSold", "undefined");
    queryToUpdate.set("SellingPrice", "undefined");
    await queryToUpdate.save();
  };
  // Function is called when a third party buys a fraction of a loan
  const buyFractionalLoan = async () => {
    await Moralis.enableWeb3();
    /* 
    Isolates and converts the loan fractions selling price from a string to a number.
    Then, it converts floating point number to wei to be used in onchain function call.
    */
    const sellingPriceIso = sellingPrice.substring(21);
    const sellingPriceIsoToNum = parseFloat(sellingPriceIso);
    const ethInWei = Moralis.Units.ETH(sellingPriceIsoToNum);
    /* 
    Splits borrower's and lender's address propoerty into string arrays in 
    order to isolate both addresses. The addresses are then refrenced by 
    their index and passed as parameters to smart contract. 
    */
    const borrowerAddr = borrower.split(" ");
    const lenderAddr = lender.split(" ");
    /* 
    Isolates the base loan and interest rate amount strings, converts them into
    floating point numbers, calculates the total fractional loan amount, calculates 
    the new base loan amount, and converts both numbers to wei to be passed as parameters 
    to smart contract.
    */
    const amountIso = amount.substring(21);
    const amountIsoFloat = parseFloat(amountIso);
    const interestAmountIso = interestAmount.substring(24);
    const interestAmountIsoFloat = parseFloat(interestAmountIso);
    const percentSoldIso = percentSold.substring(26);
    const percentSoldFloat = parseFloat(percentSoldIso);
    const totalLoanFractionAmount =
      ((amountIsoFloat + interestAmountIsoFloat) * percentSoldFloat) / 100;
    const totalLoanFractionAmountToWei = Moralis.Units.ETH(
      totalLoanFractionAmount
    );
    const newOwedAmount =
      amountIsoFloat + interestAmountIsoFloat - totalLoanFractionAmount;
    const newOwedAmountToWei = Moralis.Units.ETH(newOwedAmount);
    // Declares buyLoanFraction function call object
    const buyFractionalLoan = {
      abi,
      contractAddress: loansAddress,
      chain: "1337",
      functionName: "buyLoanFraction",
      msgValue: ethInWei,
      params: {
        _lender: lenderAddr[1],
        _borrower: borrowerAddr[1],
        fractionalLoanAmount: totalLoanFractionAmountToWei,
        newBaseLoanAmount: newOwedAmountToWei,
      },
    };
    /* 
    Executes buyLoanFraction with the above object, 
    then updates the active loan with new loan information
    */
    await Moralis.executeFunction(buyFractionalLoan);
    const query = new Moralis.Query("ActivatedLoans");
    const queriedLoan = await query.get(id);
    queriedLoan.set("FractionalBuyersAddr", user.get("ethAddress"));
    queriedLoan.set("FractionalAmount", totalLoanFractionAmount);
    await queriedLoan.save();
  };

  return (
    <div className="strip-container" style={{ border: "6px solid gray" }}>
      <li className="strip">{amount}</li>
      <li className="strip">{interestRate}</li>
      <li className="strip">{interestAmount}</li>
      <li className="strip">{duration}</li>
      <li className="strip">{borrower}</li>
      <li className="strip">{lender}</li>
      <li className="strip">{percentSold}</li>
      <li className="strip">{sellingPrice}</li>
      <button
        className="btn"
        /*
         Determins which function to run based on whether the lender
         is selling 100% of their loan, or just a fraction
        */
        onClick={
          percentSold.split(" ")[5] === "100"
            ? () => buyFullLoan()
            : () => buyFractionalLoan()
        }
      >
        BUY
      </button>
    </div>
  );
};

export default FractionalStrip;
