import pytest
from brownie import Loans, accounts
from scripts.utils import get_account
from web3 import Web3 as w3


@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass


@pytest.fixture
def account():
    account = get_account()
    return account


@pytest.fixture
def deploy_contract(account):
    contract = Loans.deploy({"from": account})
    return contract


@pytest.fixture
def propose_loans(deploy_contract, account):
    contract = deploy_contract
    propose_loan_tx = contract.proposeLoan(
        w3.toWei(1, "ether"), 5, 10, {"from": account}
    )
    return propose_loan_tx


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


@pytest.fixture()
def payback(deploy_contract, propose_loans, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    propose_loans
    lend
    amount_borrowed = contract.activeLoans(lender, borrower)[0]
    amount_borrowed_interest = contract.activeLoans(lender, borrower)[6]
    total_debt = amount_borrowed + amount_borrowed_interest
    contract.payback(lender, {"from": borrower, "value": total_debt})


@pytest.fixture
def list_loan(deploy_contract, propose_loans, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    propose_loans
    lend
    list_loan_tx = contract.listLoan(
        borrower, w3.toWei(1, "ether"), 100, {"from": lender}
    )
    return list_loan_tx


@pytest.fixture
def buy_loan(deploy_contract, propose_loans, lend, list_loan, account):
    contract = deploy_contract
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    propose_loans
    lend
    list_loan
    loan_price = contract.activeLoans(lender, borrower)[5]
    buy_loan_tx = contract.buyLoan(
        lender, borrower, {"from": buyer, "value": loan_price}
    )
    return buy_loan_tx
