# Tests that all struct fields for the active loan mapping are correct
# once the lend function is called
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


# Checks that the new active loan that ties the lender to the
# borrower matches the old loans amount field
def test_active_amount(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    loan_amount = contract.activeLoans(accounts[1], account)[0]
    assert loan_amount == w3.toWei(1, "ether")


def test_active_interest_percent(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    interest_rate_percent = contract.activeLoans(accounts[1], account)[1]
    assert interest_rate_percent == 5


def test_active_interest_amount(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    interest_rate_amount = contract.activeLoans(accounts[1], account)[2]
    assert interest_rate_amount == w3.toWei(0.05, "ether")


def test_active_loan_duration(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    active_loan_duration = contract.activeLoans(accounts[1], account)[3]
    assert active_loan_duration == 10


def test_active_loan_duration(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    start_timestamp = contract.activeLoans(accounts[1], account)[4]
    assert start_timestamp == w3.eth.get_block("latest").timestamp


def test_active_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    active_loan_sale_price = contract.activeLoans(accounts[1], account)[5]
    assert active_loan_sale_price == 0


def test_active_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    loan_fraction_percentage = contract.activeLoans(accounts[1], account)[6]
    assert loan_fraction_percentage == 0


def test_active_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    loan_fraction_amount = contract.activeLoans(accounts[1], account)[7]
    assert loan_fraction_amount == 0


def test_active_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    fractiona_owner = contract.activeLoans(accounts[1], account)[8]
    assert fractiona_owner == "0x0000000000000000000000000000000000000000"


def test_active_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    is_proposed = contract.activeLoans(accounts[1], account)[9]
    assert is_proposed == False


def test_active_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    is_active = contract.activeLoans(accounts[1], account)[10]
    assert is_active == True


def test_active_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    is_for_sale = contract.activeLoans(accounts[1], account)[11]
    assert is_for_sale == False
