# Checks that the proposed loan mapping is deleted
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def test_proposed_amount(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    loan_amount = contract.proposedLoans(account)[0]
    assert loan_amount == 0


def test_proposed_interest_percent(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    interest_rate_percent = contract.proposedLoans(account)[1]
    assert interest_rate_percent == 0


def test_proposed_interest_amount(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    interest_rate_amount = contract.proposedLoans(account)[2]
    assert interest_rate_amount == 0


def test_proposed_loan_duration(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    active_loan_duration = contract.proposedLoans(account)[3]
    assert active_loan_duration == 0


def test_proposed_loan_duration(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    start_timestamp = contract.proposedLoans(account)[4]
    assert start_timestamp == 0


def test_proposed_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    active_loan_sale_price = contract.proposedLoans(account)[5]
    assert active_loan_sale_price == 0


def test_proposed_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    loan_fraction_percentage = contract.proposedLoans(account)[6]
    assert loan_fraction_percentage == 0


def test_proposed_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    loan_fraction_amount = contract.proposedLoans(account)[7]
    assert loan_fraction_amount == 0


def test_proposed_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    fractiona_owner = contract.proposedLoans(account)[8]
    assert fractiona_owner == "0x0000000000000000000000000000000000000000"


def test_proposed_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    is_proposed = contract.proposedLoans(account)[9]
    assert is_proposed == False


def test_proposed_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    is_active = contract.proposedLoans(account)[10]
    assert is_active == False


def test_proposed_sale_price(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    is_for_sale = contract.proposedLoans(account)[11]
    assert is_for_sale == False
