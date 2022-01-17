const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "indebted",
          "type": "address"
        }
      ],
      "name": "Blacklisted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_interestPercentage",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_proposer",
          "type": "address"
        }
      ],
      "name": "Proposal",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_lender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        }
      ],
      "name": "ProposalFilled",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "activeLoans",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interestPercentage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interestAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestampStart",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "forSalePrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "loanFractionPercentage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "loanFractionAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "fractionalOwner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isProposed",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isForSale",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        }
      ],
      "name": "blackListAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_lender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        }
      ],
      "name": "buyLoan",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_lender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "fractionalLoanAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "newBaseLoanAmount",
          "type": "uint256"
        }
      ],
      "name": "buyLoanFraction",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isBlackListed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_borrower",
          "type": "address"
        }
      ],
      "name": "lend",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_salePrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_loanFraction",
          "type": "uint256"
        }
      ],
      "name": "listLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_lender",
          "type": "address"
        }
      ],
      "name": "payback",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_interesetRatePercent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        }
      ],
      "name": "proposeLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "proposedLoans",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interestPercentage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interestAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestampStart",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "forSalePrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "loanFractionPercentage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "loanFractionAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "fractionalOwner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isProposed",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isForSale",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_lender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        }
      ],
      "name": "viewActiveLoans",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestPercentage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestampStart",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "forSalePrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanFractionPercentage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanFractionAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "fractionalOwner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isProposed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isForSale",
              "type": "bool"
            }
          ],
          "internalType": "struct Loans.Loan",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        }
      ],
      "name": "viewLoanProposals",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestPercentage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestampStart",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "forSalePrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanFractionPercentage",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "loanFractionAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "fractionalOwner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isProposed",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isForSale",
              "type": "bool"
            }
          ],
          "internalType": "struct Loans.Loan",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

export default abi