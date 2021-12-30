# Tests requirement statements in the lend function
import brownie
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

# Confirms that lending to an account without a proposal cannot be done
def test_lend_revert(deploy_contract, account):
    contract = deploy_contract
    borrower = account
    lender = accounts[1]
    with brownie.reverts("Account has no active loan proposals"):
        contract.lend(borrower, {"from": lender, "value": w3.toWei(1, "ether")})
