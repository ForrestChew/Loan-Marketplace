# import brownie
# from brownie import accounts
# from web3 import Web3

# # using Ganache-cli as the provider
# w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


# def test_blacklist_borrower_single_lender(
#     deploy_contract, propose_loans, lend, account
# ):
#     print(w3.eth.get_block("latest").timestamp)
#     contract = deploy_contract
#     borrower = account
#     lender = accounts[1]
#     propose_loans
#     print(contract.proposedLoans(borrower))
#     lend
#     print(contract.activeLoans(lender, borrower)[3])

#     print(w3.eth.get_block("latest").timestamp + 100000000)
#     contract.blacklistAddress(borrower, {"from": lender})
