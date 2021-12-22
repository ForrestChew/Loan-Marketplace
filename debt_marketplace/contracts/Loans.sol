//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Loans {
    struct Loan {
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        uint256 forSalePrice;
        bool isProposed;
        bool isActive;
        bool isForSale;
    }
    mapping(address => Loan) public proposedLoans;
    mapping(address => mapping(address => Loan)) public activeLoans;

    function proposeLoan(
        uint256 _amount,
        uint256 _interesetRatePercent,
        uint256 _duration
    ) external {
        uint256 interestRate = (_amount * _interesetRatePercent * 10**18) /
            (100 * 10**18);
        require(
            proposedLoans[msg.sender].isProposed == false,
            "Account already has proposed loan or has active loan"
        );
        proposedLoans[msg.sender] = Loan(
            _amount,
            interestRate,
            _duration,
            0,
            true, //isProposed
            false, //isActive
            false //isForSale
        );
    }

    function lend(address payable _borrower) public payable {
        //make sure loan exits and not active
        require(
            proposedLoans[_borrower].isProposed == true,
            "Account has no active loan proposals"
        );
        // assign ownership of the loan and updates loan status to being active
        activeLoans[msg.sender][_borrower] = Loan(
            proposedLoans[_borrower].amount,
            proposedLoans[_borrower].interestRate,
            proposedLoans[_borrower].duration,
            0,
            false,
            true,
            false
        );
        //Deletes proposed loan mapping and updates it with who lent to the
        // borrower using a nested mapping
        delete proposedLoans[_borrower];
        uint256 amountToLend = activeLoans[msg.sender][_borrower].amount;
        //Transfers proposed loan amount from lender to borrower
        (bool success, ) = _borrower.call{value: amountToLend}("");
        require(success, "Transaction failed");
    }

    //Borrower's call this function to pay back their loan
    function payback(address payable _lender) public payable {
        //Caluculates total borrower debt. Base loan + interest rate
        uint256 debt = activeLoans[_lender][msg.sender].amount +
            activeLoans[_lender][msg.sender].interestRate;
        require(
            activeLoans[_lender][msg.sender].isActive == true,
            "Nonexistant loan cannot be paid back"
        );
        //Ensures the amount of ETH paid back matches how much is owed
        require(msg.value == debt, "Amount paid back has to be exact");
        (bool success, ) = _lender.call{value: debt}("");
        require(success, "Transaction failed");
    }

    //Lenders can call this function to sell off their loan to someone else
    function listLoan(address _borrower, uint256 _salePrice) external {
        require(
            activeLoans[msg.sender][_borrower].isActive == true,
            "You do not have the rights to sell this loan"
        );
        activeLoans[msg.sender][_borrower].forSalePrice = _salePrice;
        activeLoans[msg.sender][_borrower].isForSale = true;
    }

    function buyLoan(address payable _lender, address _borrower)
        external
        payable
    {
        require(
            activeLoans[_lender][_borrower].isForSale == true &&
                msg.value == activeLoans[_lender][_borrower].forSalePrice,
            "Loan either does not exist or is not for sale"
        );
        activeLoans[msg.sender][_borrower] = activeLoans[_lender][_borrower];
        activeLoans[msg.sender][_borrower].isForSale = false;
        activeLoans[msg.sender][_borrower].forSalePrice = 0;
        delete activeLoans[_lender][_borrower];
        (bool success, ) = _lender.call{value: msg.value}("");
        require(success, "Transaction failed");
    }
}
