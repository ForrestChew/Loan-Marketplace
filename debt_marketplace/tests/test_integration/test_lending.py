import brownie
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def test_lend(deploy_contract, propose_loans, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    # Popose loan from main account in order to lend
    propose_loans
    lend
    # collecting borrower's proposed loan struct fields with lender ownership
    assert contract.activeLoans(lender, borrower)[0] == w3.toWei(1, "ether")
    assert contract.activeLoans(lender, borrower)[1] == 5
    assert contract.activeLoans(lender, borrower)[2] == w3.toWei(0.05, "ether")
    # Multiplies the input number of days, which in this case is 10,
    # by 86,400 to get the number of seconds
    assert contract.activeLoans(lender, borrower)[3] == 10 * 86400
    assert (
        contract.activeLoans(lender, borrower)[4]
        == w3.eth.get_block("latest").timestamp
    )
    assert contract.activeLoans(lender, borrower)[5] == 0
    assert contract.activeLoans(lender, borrower)[6] == 0
    assert contract.activeLoans(lender, borrower)[7] == 0
    assert contract.activeLoans(lender, borrower)[8] == (
        "0x0000000000000000000000000000000000000000"
    )
    assert contract.activeLoans(lender, borrower)[9] is False
    assert contract.activeLoans(lender, borrower)[10] is True
    assert contract.activeLoans(lender, borrower)[11] is False
    assert borrower.balance() == w3.toWei(101, "ether")
    assert lender.balance() == w3.toWei(99, "ether")


def test_lend_reverts(deploy_contract, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    with brownie.reverts("Account has no active loan proposals"):
        lend_tx = contract.lend(
            borrower, {"from": lender, "value": w3.toWei(1, "ether")}
        )
        lend_tx.wait(1)


def test_loan_proposal_deletion(deploy_contract, propose_loans, lend, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    lend
    assert contract.proposedLoans(borrower)[0] == 0
    assert contract.proposedLoans(borrower)[1] == 0
    assert contract.proposedLoans(borrower)[2] == 0
    assert contract.proposedLoans(borrower)[3] == 0
    assert contract.proposedLoans(borrower)[3] == 0
    assert contract.proposedLoans(account)[5] == 0
    assert contract.proposedLoans(borrower)[6] == 0
    assert contract.proposedLoans(borrower)[7] == 0
    assert contract.proposedLoans(borrower)[8] == (
        "0x0000000000000000000000000000000000000000"
    )
    assert contract.proposedLoans(borrower)[9] is False
    assert contract.proposedLoans(borrower)[10] is False
    assert contract.proposedLoans(borrower)[11] is False
