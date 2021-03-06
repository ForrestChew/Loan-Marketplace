# Tests the proposeLoan frunctions functionality.
# Tests use setup fixtures that can be found in conftest.py
import brownie
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

# Tests that a user can propose a loan
def test_propose_loan(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    # Confirms that the loan proposal now exists with the correct fields
    assert contract.proposedLoans(account)[0] == w3.toWei(1, "ether")
    assert contract.proposedLoans(account)[1] == 5
    assert contract.proposedLoans(account)[2] == w3.toWei(0.05, "ether")
    # Multiplies the input number of days, which in this case is 10,
    # by 86,400 to get the number of seconds. The will help determine when the loan expires down the road.
    assert contract.proposedLoans(account)[3] == 10 * 86400
    assert contract.proposedLoans(account)[4] == 0
    assert contract.proposedLoans(account)[5] == 0
    assert contract.proposedLoans(account)[6] == 0
    assert contract.proposedLoans(account)[7] == 0
    assert contract.proposedLoans(account)[8] == (
        "0x0000000000000000000000000000000000000000"
    )
    assert contract.proposedLoans(account)[9] is True
    assert contract.proposedLoans(account)[10] is False
    assert contract.proposedLoans(account)[11] is False

# Confirms that a user can only have one loan proposal
def test_propose_loan_reverts(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    # Attempts to propse a second loan. Will revert since any account can
    # only have one proposal at any given time.
    with brownie.reverts("Proposal already exists"):
        propose_loan_tx = contract.proposeLoan(
            w3.toWei(2, "ether"),
            w3.toWei(0.1, "ether"),
            30,  # days
            {"from": account},
        )
        propose_loan_tx.wait(1)
