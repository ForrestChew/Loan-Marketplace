// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract LoanFactory {
    struct Loan {
        uint256 idx;
        uint256 id;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 loanDuration;
        uint256 loanStartTime;
        address borrower;
        address[] lenders;
        bool isProposed;
        bool isActive;
        bool isForSale;
    }

    struct FractionalSale {
        uint256 loanId;
        uint256 price;
        uint256 percentage;
    }

    uint256[] internal loanKeys;

    mapping(uint256 => Loan) public loanIdToLoan;
    mapping(address => mapping(uint256 => FractionalSale))
        public fractionalSales;
    mapping(address => mapping(uint256 => uint256)) public lenderPercentAmounts;

    event LoanProposalCreated(
        uint256 id,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanDuration,
        address borrower
    );

    event Lend(uint256 id, address lender);

    event DebtPaid(uint256 id, uint256 totalDebt);

    /**
     * @notice - Creates the loan proposal structure by assiging
     * assigning an ID to it, then pushing that ID to an array,
     * in addition to keeping track of it's idx in the array. This
     * is done as the ID combined with it's idx can be used as
     * key with constant lookup time.
     * @param _loanAmount - The amount a user wants to borrow.
     * @param _interestRate - The interest rate for the loan.
     * @param _loanDuration - The amount of time the borrower
     * has to payback the loan.
     */
    function createProposal(
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _loanDuration
    ) internal {
        uint256 proposalId = _getLoanProposalId(_loanAmount, _interestRate);
        uint256 loanKeyIdx = loanKeys.length;
        loanIdToLoan[proposalId] = Loan({
            idx: loanKeyIdx,
            id: proposalId,
            loanAmount: _loanAmount,
            interestRate: _interestRate,
            loanDuration: _loanDuration,
            loanStartTime: 0,
            borrower: msg.sender,
            lenders: new address[](0),
            isProposed: true,
            isActive: false,
            isForSale: false
        });
        loanKeys.push(proposalId);
        emit LoanProposalCreated(
            proposalId,
            _loanAmount,
            _interestRate,
            _loanDuration,
            msg.sender
        );
    }

    /**
     * @notice - Gets current loan proposals.
     * @return - Array of loan proposal structs.
     */
    function getLoanProposals() public view returns (Loan[] memory) {
        Loan[] memory loans = new Loan[](loanKeys.length);
        for (uint256 i = 0; i < loanKeys.length; i++) {
            loans[i] = loanIdToLoan[loanKeys[i]];
        }
        return loans;
    }

    /**
     * @notice - Updates a current loan proposal when someone
     * lends the full loan amount to the borrower.
     * @param _proposalId - The ID of the proposal to lend on.
     */
    function updateProposalOnLend(uint256 _proposalId) internal {
        require(
            loanIdToLoan[_proposalId].isProposed,
            "lend: Non-existant proposal"
        );
        loanIdToLoan[_proposalId].loanStartTime = block.timestamp;
        loanIdToLoan[_proposalId].isProposed = false;
        loanIdToLoan[_proposalId].isActive = true;
        loanIdToLoan[_proposalId].lenders.push(msg.sender);
        lenderPercentAmounts[msg.sender][_proposalId] = 100;
        emit Lend(_proposalId, msg.sender);
    }

    /**
     * @notice - Deletes the resolved proposal.
     * @param _proposalId - The ID of the proposal to delete.
     * @param _totalDebt - Base loan plus loan interest.
     */
    function deleteLoan(uint256 _proposalId, uint256 _totalDebt) internal {
        if (loanKeys.length >= 2) {
            uint256 loanToDeleteIdx = loanIdToLoan[_proposalId].idx;
            loanIdToLoan[loanKeys[loanKeys.length - 1]].idx = loanToDeleteIdx;
            loanKeys[loanToDeleteIdx] = loanKeys[loanKeys.length - 1];
            loanKeys.pop();
        } else {
            loanKeys.pop();
        }
        emit DebtPaid(_proposalId, _totalDebt);
    }

    /**
     * @notice - Creates an ID for a loan proposal struct based
     * off of three params found within the target proposal.
     * @param _loanAmount - The amount a user wants to borrow.
     * @param _interestRate - The interest rate for the loan.
     * @return - The has of the three function arguments. This will
     * be used as the ID for that loan proposal.
     */
    function _getLoanProposalId(uint256 _loanAmount, uint256 _interestRate)
        private
        view
        returns (uint256)
    {
        bytes32 proposalId = keccak256(
            abi.encodePacked(
                msg.sender,
                _loanAmount,
                _interestRate,
                block.timestamp
            )
        );
        return uint256(proposalId);
    }
}
