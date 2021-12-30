import brownie
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def test_payback_non_fractional(deploy_contract, propose_loans, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    initial_amount = contract.activeLoans(lender, borrower)[0]
    # Fractional will be equal to zero since this tests a non fractional loan
    fractional_amount = contract.activeLoans(lender, borrower)[2]
    total_amount = initial_amount + fractional_amount
    propose_loans
    lend
    contract.payback(lender, {"from": borrower, "value": total_amount})
    assert lender.balance() == w3.toWei(100.05, "ether")
    assert borrower.balance() == w3.toWei(99.95, "ether")


# Confirms that the new debt owner gets paid back when borrower makes payment
def test_fractional_loan_payback(deploy_contract, propose_loans, lend, account):
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    contract = deploy_contract
    propose_loans
    lend
    contract.listLoan(borrower, w3.toWei(0.5, "ether"), 50, {"from": lender})
    for_sale_price = contract.activeLoans(lender, borrower)[5]
    contract.buyLoan(lender, borrower, {"from": buyer, "value": for_sale_price})
    initial_amount = contract.activeLoans(lender, borrower)[0]
    fractional_amount = contract.activeLoans(lender, borrower)[7]
    total_amount = initial_amount + fractional_amount
    contract.payback(lender, {"from": borrower, "value": total_amount})
    assert borrower.balance() == w3.toWei(99.95, "ether")
    assert lender.balance() == w3.toWei(100.025, "ether")
    assert buyer.balance() == w3.toWei(100.025, "ether")


def test_proposed_loan_is_active_reverts(deploy_contract, account):
    with brownie.reverts("Nonexistant loan cannot be paid back"):
        contract = deploy_contract
        contract.payback(accounts[1], {"from": account, "value": w3.toWei(1, "ether")})


def test_payback_amount_reverts(deploy_contract, propose_loans, lend, account):
    with brownie.reverts("Amount paid back has to be exact"):
        contract = deploy_contract
        borrower = account
        lender = accounts[1]
        propose_loans
        lend
        contract.payback(lender, {"from": borrower, "value": w3.toWei(2, "ether")})
