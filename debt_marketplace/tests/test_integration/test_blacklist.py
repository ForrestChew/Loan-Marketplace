# Incomeplete test file.
import brownie
from brownie import accounts

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
