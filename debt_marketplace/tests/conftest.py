# This file contains fixtures to be used in each unit and integration test
import pytest
from brownie import Loans, accounts
from scripts.utils import get_account
from web3 import Web3 as w3

# This resets the firxtures for each test
@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass


# Ganache-cli accounts[0] is defined as account.
# This account will be used as the "borrower" throughout testing.
@pytest.fixture
def account():
    account = get_account()
    return account


# Contract instance is created
@pytest.fixture
def deploy_contract(account):
    contract = Loans.deploy({"from": account})
    return contract


# User makes loan proposal
@pytest.fixture
def propose_loans(deploy_contract, account):
    contract = deploy_contract
    propose_loan_tx = contract.proposeLoan(
        w3.toWei(1, "ether"), 5, 10, {"from": account}
    )
    return propose_loan_tx


# User deletes their loan proposal
@pytest.fixture()
def delete_loan_proposal(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    contract.deleteLoanProposal({"from": borrower})


# Sets up a loan where a user lends to an unfilled loan
@pytest.fixture
def lend(deploy_contract, propose_loans, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    # Popose loan from main account in order to lend
    propose_loans
    loan_amount = contract.proposedLoans(borrower)[0]
    lend_tx = contract.lend(borrower, {"from": lender, "value": loan_amount})
    return lend_tx

# Sets up a loan where the lender lists a 100% of that loan to sell
@pytest.fixture
def list_loan(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    list_loan_tx = contract.listLoan(
        borrower, w3.toWei(1, "ether"), 100, {"from": lender}
    )
    return list_loan_tx


# Sets up a loan where the lender lists a portion of that loan to sell
@pytest.fixture
def list_fractional_loan(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    list_fractional_loan_tx = contract.listLoan(
        borrower, w3.toWei(0.5, "ether"), 50, {"from": lender}
    )
    return list_fractional_loan_tx


# Simulates a loan where the lender lists 100% of their loan and a third party buys it
@pytest.fixture
def buy_loan(deploy_contract, list_loan, account):
    contract = deploy_contract
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    list_loan
    loan_price = contract.activeLoans(lender, borrower)[5]
    buy_loan_tx = contract.buyLoan(
        lender, borrower, {"from": buyer, "value": loan_price}
    )
    return buy_loan_tx


# Simulates a loan where the lender lists a fraction of their loan and a third party buys it
@pytest.fixture
def buy_loan_fractional(deploy_contract, list_fractional_loan, account):
    contract = deploy_contract
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    list_fractional_loan
    base_loan_amount = contract.activeLoans(lender, borrower)[0]
    interest_rate_amount = contract.activeLoans(lender, borrower)[2]
    loan_fraction_percentage = contract.activeLoans(lender, borrower)[6]
    fractional_for_sale_price = contract.activeLoans(lender, borrower)[5]
    # Calculates the fractional loan amount using the equation
    total_loan_fraction_amount = (
        (base_loan_amount + interest_rate_amount)
        * loan_fraction_percentage
        / (100 * 10 ** 18)
    )
    # Converts result of above number to wei
    total_loan_fraction_amount_wei = w3.toWei(total_loan_fraction_amount, "ether")
    # Finds the new base loan amount by taking the current base loan amount and subtracting #
    # the total loan fraction amount
    new_base_loan_amount = (
        base_loan_amount + interest_rate_amount
    ) - total_loan_fraction_amount_wei
    buy_loan_fraction_tx = contract.buyLoanFraction(
        lender,
        borrower,
        total_loan_fraction_amount_wei,
        new_base_loan_amount,
        {"from": buyer, "value": fractional_for_sale_price},
    )
    return buy_loan_fraction_tx
