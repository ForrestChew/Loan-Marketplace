// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./LoanFactory.sol";

contract LoanMarketplace is LoanFactory {
    address public owner;
    uint256 public listingFee;

    event NewLoanFraction(uint256 loanId, uint256 percentage, uint256 price);

    event LoanFractionSold(
        uint256 loanId,
        address buyer,
        uint256 percentage,
        uint256 price
    );

    /**
     * @notice - Ran once on contract creation.
     * @param _owner - The address to be made owner. This
     * address will have rights to withdraw the listing fees.
     * @param _listingFee - The fee a user has to pay to list
     * their loan proposal.
     */
    constructor(address _owner, uint256 _listingFee) {
        owner = _owner;
        listingFee = _listingFee;
    }

    /**
     * @notice - Calculates the amount a borrower owes on their loan.
     * @param _loanId - The ID of the loan to calculate debt.
     * @return - The total amount a borrower owes. Base loan amount + interest rate.
     */
    function getTotalDebt(uint256 _loanId) public view returns (uint256) {
        uint256 loanAmount = loanIdToLoan[_loanId].loanAmount;
        uint256 interestRate = loanIdToLoan[_loanId].interestRate;
        uint256 totalInterest = (loanAmount * (interestRate * 100)) / 10000;
        uint256 totalDebt = loanAmount + totalInterest;
        return totalDebt;
    }

    /**
     * @notice - Enables user to propose a loan.
     * @param _loanAmount - The amount a user wants to borrow.
     * @param _interestRate - The interest rate for the loan.
     * @param _loanDuration - The amount of time the borrower
     * has to payback the loan.
     */
    function proposeLoan(
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _loanDuration
    ) external payable {
        require(msg.value == listingFee, "proposeLoan: Listing fee required");
        createProposal(_loanAmount, _interestRate, _loanDuration);
    }

    /**
     * @notice - Allows a user to lend to a loan.
     * @param _proposalId - The ID of the loan a user wishes to lend on.
     */
    function lend(uint256 _proposalId) external payable {
        require(
            msg.value == loanIdToLoan[_proposalId].loanAmount,
            "lend: Incorrect Amount"
        );
        _sendFunds(loanIdToLoan[_proposalId].borrower, msg.value);
        // (bool lendTx, ) = payable(loanIdToLoan[_proposalId].borrower).call{
        //     value: msg.value
        // }("");
        // require(lendTx, "lend: lendTx failed");
        updateProposalOnLend(_proposalId);
    }

    /**
     * @notice - Enabels lenders to sell portions of their loan.
     * @param _loanId - ID of the loan a lender wishes to sell a fraction of.
     * @param _price - Price to sell the fraction for.
     * @param _percentage - Fraction of loan to sell.
     */
    function sellLoanFraction(
        uint256 _loanId,
        uint256 _price,
        uint256 _percentage
    ) external {
        require(
            _percentage <= lenderPercentAmounts[msg.sender][_loanId],
            "sellLoanFraction: Cant sell more than owned"
        );
        fractionalSales[msg.sender][_loanId] = FractionalSale({
            loanId: _loanId,
            price: _price,
            percentage: _percentage
        });
        emit NewLoanFraction(_loanId, _percentage, _price);
    }


    /**
     * @notice - Enabels users to buy fractions of loans sold by
     * active lenders.
     * @param _seller - Address of lender who is selling the fraction.
     * @param _loanId - ID of the loan that a fraction is being sold as.
     */
    function buyLoanFraction(address _seller, uint256 _loanId)
        external
        payable
    {
        uint256 fractionPrice = fractionalSales[_seller][_loanId].price;
        require(
            msg.value == fractionPrice,
            "buyLoanFraction: Incorrect amount"
        );
        uint256 fractionPercent = fractionalSales[_seller][_loanId].percentage;
        loanIdToLoan[_loanId].lenders.push(msg.sender);
        lenderPercentAmounts[_seller][_loanId] -= fractionPercent;
        lenderPercentAmounts[msg.sender][_loanId] += fractionPercent;
        // (bool fractionSaleTx, ) = payable(_seller).call{value: fractionPrice}(
        //     ""
        // );
        // require(fractionSaleTx, "buyLoanFraction: Tx failed");
        _sendFunds(_seller, msg.value);
        delete fractionalSales[_seller][_loanId];
        emit LoanFractionSold(
            _loanId,
            msg.sender,
            fractionPercent,
            fractionPrice
        );
    }

    /**
     * @notice - Borrowers can payoff their loans.
     * @param _loanId - The ID of the loan to payback.
     */
    function payoffDebt(uint256 _loanId) external payable {
        uint256 totalDebt = getTotalDebt(_loanId);
        require(
            loanIdToLoan[_loanId].isActive,
            "payoffDebt: Non-existant loan"
        );
        require(msg.value == totalDebt, "payoffDebt: Incorrect Amount");
        address[] memory lenders = loanIdToLoan[_loanId].lenders;
        for (uint256 i = 0; i < lenders.length; i++) {
            uint256 percentOfLoan = lenderPercentAmounts[lenders[i]][_loanId];
            uint256 amountOwed = (totalDebt * (percentOfLoan * 100)) / 10000;
            _sendFunds(lenders[i], amountOwed);
            // (bool paybackTx, ) = payable(lenders[i]).call{value: amountOwed}(
            //     ""
            // );
            // require(paybackTx, "paybackTx: Tx failed");
        }
        deleteLoan(_loanId, totalDebt);
    }

    function _sendFunds(address _to, uint256 _amount) private  {
        (bool sendFundsTx,) = payable(_to).call{value: _amount}("");
        require(sendFundsTx, "_sendFunds: Tx Failed");
    }

}
