import brownie
from brownie import accounts
from web3 import Web3


# def test_blacklist_borrower_single_lender(
#     deploy_contract, propose_loans, lend, account
# ):
#     evm_increase_time_dict = {
#         "method": "evm_increaseTime",
#         "params": [60],
#     }
#     # using Ganache-cli as the provider
#     w3 = Web3(
#         Web3.HTTPProvider(
#             "http://127.0.0.1:8545", request_kwargs=evm_increase_time_dict
#         )
#     )
#     contract = deploy_contract
#     borrower = account
#     lender = accounts[1]
#     propose_loans
#     lend
#     evm_force_mine = {
#         "id": 1337,
#         "jsonrpc": "2.0",
#         "method": "evm_mine",
#         "params": [w3.eth.get_block("latest").timestamp],
#     }
#     print(w3)
#     assert 1 == 2


# Confirms that the borrower's account cannot be blacklisted if loan has not expired yet
def test_blacklist_reverts(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    borrower = account
    lender = accounts[1]
    propose_loans
    lend
    with brownie.reverts("Loan has not expired yet"):
        contract.blacklistAddress(borrower, {"from": lender})
    assert contract.isBlacklisted(borrower) is False
