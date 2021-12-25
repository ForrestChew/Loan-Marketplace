//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Loans {
    struct Loan {
        uint256 amount; //0
        uint256 interestPercentage; //1
        uint256 interestAmount; //2
        uint256 duration; //3
        uint256 forSalePrice; //4
        uint256 loanFractionPercentage; //5 //Percentage split if lender decides to sell borrowers debt fractionally
        uint256 loanFractionAmount; //6
        address fractionalOwner; //7
        bool isProposed; //8
        bool isActive; //9
        bool isForSale; //10
    }
    mapping(address => Loan) public proposedLoans;
    mapping(address => mapping(address => Loan)) public activeLoans;

    function proposeLoan(
        uint256 _amount,
        uint256 _interesetRatePercent,
        uint256 _duration
    ) external {
        uint256 interestRateAmount = (_amount *
            _interesetRatePercent *
            10**18) / (100 * 10**18);
        require(
            proposedLoans[msg.sender].isProposed == false,
            "Account already has proposed loan or has active loan"
        );
        proposedLoans[msg.sender] = Loan(
            _amount,
            _interesetRatePercent,
            interestRateAmount,
            _duration,
            0,
            0,
            0,
            address(0),
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
            proposedLoans[_borrower].interestPercentage,
            proposedLoans[_borrower].interestAmount,
            proposedLoans[_borrower].duration,
            0,
            0,
            0,
            address(0),
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
        // Caluculates total borrower debt. Base loan + interest amount
        uint256 totalDebt = activeLoans[_lender][msg.sender].amount +
            activeLoans[_lender][msg.sender].loanFractionAmount;
        require(
            activeLoans[_lender][msg.sender].isActive == true,
            "Nonexistant loan cannot be paid back"
        );
        //Ensures the amount of ETH paid back matches how much is owed
        require(msg.value == totalDebt, "Amount paid back has to be exact");
        (bool success, ) = _lender.call{
            value: activeLoans[_lender][msg.sender].amount
        }("");
        require(success, "Transaction failed");
        (bool accept, ) = activeLoans[_lender][msg.sender].fractionalOwner.call{
            value: activeLoans[_lender][msg.sender].loanFractionAmount
        }("");
        require(accept, "Transaction failed");
    }

    //Lenders can call this function to sell off their loan to someone else
    function listLoan(
        address _borrower,
        uint256 _salePrice,
        uint256 _loanFraction
    ) external {
        require(
            activeLoans[msg.sender][_borrower].isActive == true,
            "You do not have the rights to sell this loan"
        );
        require(
            activeLoans[msg.sender][_borrower].fractionalOwner == address(0),
            "Loan can only be sold once"
        );
        activeLoans[msg.sender][_borrower].forSalePrice = _salePrice;
        activeLoans[msg.sender][_borrower]
            .loanFractionPercentage = _loanFraction;
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
        //Calculates the fractional split amount if a lender wants to sell less than 100% of loan
        if (activeLoans[_lender][_borrower].loanFractionPercentage == 100) {
            //Changes ownership by switching the key to loan
            activeLoans[msg.sender][_borrower] = activeLoans[_lender][
                _borrower
            ];
            activeLoans[msg.sender][_borrower].loanFractionPercentage = 0;
            activeLoans[msg.sender][_borrower].isForSale = false;
            delete activeLoans[_lender][_borrower];
        } else {
            /* The loan fraction amount only calculates if the loan is to be owned by two parties
            E.G. One party does not own 100 percent of loan
            This was done to save gas */
            uint256 totalAmount = activeLoans[_lender][_borrower].amount +
                activeLoans[_lender][_borrower].interestAmount;
            uint256 loanFractionAmountTotal = (totalAmount *
                (activeLoans[_lender][_borrower].loanFractionPercentage *
                    10**18)) / (100 * 10**18);
            //Assigns amounts and percentage split and updates struct fields
            activeLoans[_lender][_borrower]
                .loanFractionAmount = loanFractionAmountTotal;
            activeLoans[_lender][_borrower].amount =
                totalAmount -
                loanFractionAmountTotal;
            activeLoans[_lender][_borrower].isForSale = false;
            activeLoans[_lender][_borrower].fractionalOwner = msg.sender;
        }
        (bool success, ) = _lender.call{value: msg.value}("");
        require(success, "Transaction failed");
    }
}
