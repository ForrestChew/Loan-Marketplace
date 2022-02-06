import { useState, useEffect, useRef } from "react";
import { useMoralis } from "react-moralis";
import Web3 from "web3";
import abi from "../ContractInfo/abi";
import loansAddress from "../ContractInfo/address";
import DisplayStrips from "./strips/DisplayStrips";
import "../styles/strips.css";
import "../styles/users-positions.css";
/*
Component will display authenticated user positions. These 
positions would be, loan proposals, filled loans, or fractional loans.
*/
const UsersPositions = () => {
  const { Moralis, user, isUnauthenticated, isAuthenticated } = useMoralis();
  /* 
  The useRef hook is used to prevent an endless loop that would
  otherwise appear from the useEffect.
  */
  const hasFetchedData = useRef(false);
  const [userProposals, setUserProposals] = useState([]);
  // Loans that user has filled / loan where the user is the lender.
  const [userLentLoans, setUserLentLoans] = useState([]);
  // Proposed loans from the user that have been filled by a lender.
  const [userFilledLoans, setUserFilledLoans] = useState([]);
  // Fractional loans where the user is the third party buyer.
  const [userBoughtLoans, setUserBoughtLoans] = useState([]);
  /*
  This useState hook is necessary because otherwise, the handleListLoan
  onChange function will fire as a user inputs values to it's selling
  loan input box.
  */
  const [listLoan, setListLoan] = useState({
    percentOfLoan: "",
    sellingPrice: "",
  });
  /*
  Retrieves the percentage of loan that the lender is selling off as well as 
  the price they are selling it for. These values are then added to the display strip.
  */
  const [queriedPercentofLoan, setQueriedPercentOfLoan] = useState("");
  const [queriedSellingPrice, setQueriedSellingPrice] = useState("");
  // The loan's state changes as the user feeds information into input box
  const handleListLoan = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setListLoan({
      ...listLoan,
      [name]: value,
    });
  };
  /* 
  Removes the loan positions for an account when the user logs
  out by setting the state values back to an empty array. 
  */
  useEffect(() => {
    if (isUnauthenticated) {
      setUserProposals([]);
      setUserLentLoans([]);
      setUserFilledLoans([]);
      setUserBoughtLoans([]);
      hasFetchedData.current = false;
    }
  }, [isUnauthenticated]);
  // Fetches authenticated user's loan positions from the Moralis DB on render.
  useEffect(() => {
    const getAccountPositions = async () => {
      // The if block will only run when useRef is false to prevent endless loop
      if (!hasFetchedData.current) {
        try {
          await Moralis.enableWeb3();
          // Querys user's loan proposal
          const queryProposals = new Moralis.Query("LoanProposals");
          const queryProposalsMatch = queryProposals.equalTo(
            "Borrower",
            user.get("ethAddress")
          );
          const proposedLoan = await queryProposalsMatch.find();
          // Querys loan that user has lent to
          const queryActiveLentLoans = new Moralis.Query("ActivatedLoans");
          const queryActiveLentLoansMatch = queryActiveLentLoans.equalTo(
            "Lender",
            user.get("ethAddress")
          );
          const lentLoans = await queryActiveLentLoansMatch.find();
          // Querys users's loan that has been filled by a third party.
          const queryActiveFilledLoan = new Moralis.Query("ActivatedLoans");
          const queryActiveFilledLoansMatch = queryActiveFilledLoan.equalTo(
            "Borrower",
            user.get("ethAddress")
          );
          const filledLoan = await queryActiveFilledLoansMatch.find();
          // Querys loan if the user is a fractional owner to that loan.
          const boughtLoans = new Moralis.Query("ActivatedLoans");
          const boughtLoansByAddr = boughtLoans.equalTo(
            "FractionalBuyersAddr",
            user.get("ethAddress")
          );
          const boughtLoan = await boughtLoansByAddr.find();
          // Sets state variables with fetched info
          setUserProposals(proposedLoan);
          setUserLentLoans(lentLoans);
          setUserFilledLoans(filledLoan);
          setUserBoughtLoans(boughtLoan);
          hasFetchedData.current = true;
        } catch (err) {
          console.log(err);
        }
      }
    };
    getAccountPositions();
  }, [Moralis, isAuthenticated, user]);
  // Creates the payback loan functionality. It can be invokes through the btn attached to the loan.
  const paybackLoan = async () => {
    const getLoanInfo = {
      abi,
      contractAddress: loansAddress,
      chain: "1337",
      functionName: "viewActiveLoans",
      params: {
        _lender: userFilledLoans[0].attributes.Lender,
        _borrower: userFilledLoans[0].attributes.Borrower,
      },
    };
    // Returns info about specified loan, and calls the payback method within smart contract with said info
    await Moralis.executeFunction(getLoanInfo).then((loanInfo) => {
      let totalAmountBn = "";
      /* 
      Determines whether this is a fractional loan by checking the 
      fractional loan's buyer address. If it's the zero address, the else block runs,
      if it's not the zero address, the if block runs.
      */
      if (loanInfo[8] !== "0x0000000000000000000000000000000000000000") {
        // The total debt is calculated with big numbers.
        totalAmountBn = Web3.utils
          .toBN(loanInfo[0])
          .add(Web3.utils.toBN(loanInfo[7]))
          .toString();
      } else {
        totalAmountBn = Web3.utils
          .toBN(loanInfo[0])
          .add(Web3.utils.toBN(loanInfo[2]))
          .toString();
      }
      // Builds pay off loan object to use in function call.
      const payoffLoan = {
        abi,
        contractAddress: loansAddress,
        chain: "1337",
        msgValue: Web3.utils.toBN(totalAmountBn),
        functionName: "payback",
        params: {
          _lender: userFilledLoans[0].attributes.Lender,
        },
      };
      Moralis.executeFunction(payoffLoan).then(() => {
        deleteActiveLoan();
      });
    });
  };
  // Deletes the activated loan from the Moralis database.
  const deleteActiveLoan = async () => {
    const query = new Moralis.Query("ActivatedLoans");
    const activeLoanQuery = await query.get(userFilledLoans[0].id);
    await activeLoanQuery.destroy();
  };

  // Lists the loan for sale.
  const sellLoan = async (percentOfLoan, sellingPrice) => {
    const listLoan = {
      abi,
      contractAddress: loansAddress,
      chain: "1337",
      functionName: "listLoan",
      params: {
        _borrower: userLentLoans[0].attributes.Borrower,
        _salePrice: Moralis.Units.ETH(sellingPrice),
        _loanFraction: percentOfLoan,
      },
    };
    await Moralis.executeFunction(listLoan).then(() => {
      updateActiveLoan();
    });
  };
  // Updatas active loan fields with the fractional loan listing info
  const updateActiveLoan = async () => {
    const query = new Moralis.Query("ActivatedLoans");
    const activeLoanQuery = await query.get(userLentLoans[0].id);
    activeLoanQuery.set("PercentOfLoanSold", listLoan.percentOfLoan);
    activeLoanQuery.set("SellingPrice", listLoan.sellingPrice);
    await activeLoanQuery.save().then(() => {
      updateDisplayStrip();
    });
  };
  // Updates the loan state variables in order to update the loan strips.
  const updateDisplayStrip = async () => {
    const query = new Moralis.Query("ActivatedLoans");
    const activeLoanQuery = await query.get(userLentLoans[0].id);
    /*
    The useState hook is necessary because otherwise, the handleListLoan
    onChange function will fire as a user inputs values to it's selling
    loan input box.
    */
    setQueriedPercentOfLoan(activeLoanQuery.attributes.PercentOfLoanSold);
    setQueriedSellingPrice(activeLoanQuery.attributes.SellingPrice);
  };
  /*
  Deletes the user's loan proposal from blockchain and then calls a
  function to delete the proposal from Moralis database.
  */
  const deleteLoanProposalFromChain = async () => {
    const deleteProposalOptions = {
      abi,
      contractAddress: loansAddress,
      chain: "1337",
      functionName: "deleteLoanProposal",
    };
    await Moralis.executeFunction(deleteProposalOptions).then(() => {
      // Calls function to delete loan proposal from database
      deleteLoanProposalFromDatabase();
    });
  };
  // Deletes loan proposal from database
  const deleteLoanProposalFromDatabase = async () => {
    const query = new Moralis.Query("LoanProposals");
    // References the user's loan proposal
    const proposalToDelete = await query.get(userProposals[0].id);
    await proposalToDelete.destroy();
  };

  return (
    <>
      {/* Displays the loan proposed by user if applicable*/}
      {userProposals.map((proposal) => {
        const { id } = proposal;
        const { Amount, InterestRate, LoanDuration, Borrower } =
          proposal.attributes;
        return (
          <div key={id}>
            <h1 className="general">Proposed</h1>
            <button
              className="btn"
              style={{ marginLeft: "14px" }}
              onClick={() => deleteLoanProposalFromChain()}
            >
              Delete Proposal
            </button>
            <DisplayStrips
              amount={`Amount Proposed: ${Amount}`}
              interestRate={`Interest Rate to Pay: ${InterestRate}`}
              duration={`Loan Duration: ${LoanDuration} days`}
              borrower={`Your address: ${Borrower}`}
            />
          </div>
        );
      })}
      {/* Displays users filled loan proposal if applicable*/}
      {userFilledLoans.map((filledLoan) => {
        const { id } = filledLoan;
        const { Amount, InterestRate, LoanDuration, Lender } =
          filledLoan.attributes;
        return (
          <div key={id}>
            <h1 className="general">Debt</h1>
            <button
              className="btn"
              style={{ marginLeft: "14px" }}
              onClick={() => paybackLoan()}
            >
              Payback
            </button>
            <DisplayStrips
              amount={`Initial Debt: ${Amount}`}
              interestRate={`Interest Rate: ${InterestRate}`}
              duration={`Loan Duration: ${LoanDuration} days`}
              lender={`Loan filled by: ${Lender}`}
            />
          </div>
        );
      })}
      {/* Displays the loan that user has lent on if applicable*/}
      {userLentLoans.map((lentLoan) => {
        const { id } = lentLoan;
        const { Amount, InterestRate, LoanDuration, Borrower } =
          lentLoan.attributes;
        return (
          <div key={id}>
            <h1 className="general">Lent</h1>
            <div>
              <label className="label">Fractional Percent:</label>
              <input
                className="inputs"
                name="percentOfLoan"
                value={listLoan.percentOfLoan}
                onChange={handleListLoan}
              />
              <br></br>
              <label className="label">Selling Price:</label>
              <input
                className="inputs"
                name="sellingPrice"
                value={listLoan.sellingPrice}
                onChange={handleListLoan}
              />
              <br></br>
              <button
                className="btn"
                style={{ marginLeft: "14px" }}
                onClick={() => {
                  sellLoan(listLoan.percentOfLoan, listLoan.sellingPrice);
                }}
              >
                Sell Loan
              </button>
            </div>
            <DisplayStrips
              amount={`Amount Lent: ${Amount} ETH`}
              interestRate={`Interest Rate: ${InterestRate}%`}
              duration={`Loan Duration: ${LoanDuration}`}
              borrower={`Borrower Address: ${Borrower}`}
              percentSold={`Fraction percent to sell: ${queriedPercentofLoan}`}
              sellingPrice={`Loan fraction selling price in ETH: ${queriedSellingPrice}`}
            />
          </div>
        );
      })}
      {/* Displays loan fractions where authenticated user is the third party buyer */}
      {userBoughtLoans.map((boughtLoan) => {
        const { id } = boughtLoan;
        const { PercentOfLoanSold, SellingPrice, FractionalAmount } =
          boughtLoan.attributes;
        return (
          <div key={id}>
            <h1 className="general">Loan Fractions Owned</h1>
            <DisplayStrips
              percentSold={`Percent of original loan owned: ${PercentOfLoanSold}%`}
              amount={`ETH to recieve: ${FractionalAmount}`}
              sellingPrice={`Bought for: ${SellingPrice} ETH`}
            />
          </div>
        );
      })}
    </>
  );
};

export default UsersPositions;
