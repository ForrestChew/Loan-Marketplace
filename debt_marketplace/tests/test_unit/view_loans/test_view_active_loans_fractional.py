# This file tests the "viewActiveLoans" function within smart
# contract when the loan IS fractional
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


# Confirms that the loans inital amount matches the users input
def test_active_loan_amount(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    active_loan_amount = contract.viewActiveLoans(lender, borrower)[0]
    print(contract.viewActiveLoans(lender, borrower))
    assert active_loan_amount == w3.toWei(0.525, "ether")


# Confirms that the loan's interest percentage matches the user's input
def test_active_loan_interest_percentage(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    active_loan_interest_percentage = contract.viewActiveLoans(lender, borrower)[1]
    print(contract.viewActiveLoans(lender, borrower))
    assert active_loan_interest_percentage == 5


# Confirms that the loan's interest amount matches users input
def test_active_loan_interest_amount(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    loan_interest_amount = contract.viewActiveLoans(lender, borrower)[2]
    assert loan_interest_amount == w3.toWei(0.05, "ether")


# Confirms that the loan's duration matches the user's input
def test_active_loan_duration(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    duration = contract.viewActiveLoans(lender, borrower)[3]
    # The number 10 is multiplied by 86400 to convert the days into seconds
    assert duration == 10 * 86400


# Comfirms that the current timestamp is 1 ahead of loan's logged timestamp
def test_active_loan_timestamp_start(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    timestamp_start = contract.viewActiveLoans(lender, borrower)[4]
    # Asserting timestamps with minus one because at least one block is mined by the time this assertion happens
    assert timestamp_start <= w3.eth.get_block("latest").timestamp


# Confirms that the for sale price of this loan is 1/2 an ETH
def test_active_loan_for_sale_price(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    loan_for_sale_price = contract.viewActiveLoans(lender, borrower)[5]
    assert loan_for_sale_price == w3.toWei(0.5, "ether")


# Confirms that the fractional percentage on the loan is 50%
# The conversion is done in conftest.py
def test_active_loan_fractional_split(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    loan_fractional_split = contract.viewActiveLoans(lender, borrower)[6]
    assert loan_fractional_split == 50


# Confrims that the fractional loan amount is 50% of borrower's total debt
# The conversion is done in conftest.py
def test_active_loan_fractional_amount(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    loan_fractional_amount = contract.viewActiveLoans(lender, borrower)[7]
    assert loan_fractional_amount == w3.toWei(0.525, "ether")


# Confirms that there IS a fractional owner
def test_active_loan_fractional_owner(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    contract = deploy_contract
    buy_loan_fractional
    loan_fractional_owner = contract.viewActiveLoans(lender, borrower)[8]
    assert loan_fractional_owner == buyer.address


# Confirms that the proposed loan is NOT proposed
def test_active_loan_is_proposed(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    is_loan_proposed = contract.viewActiveLoans(lender, borrower)[9]
    assert is_loan_proposed is False


# Confirms that the proposed loan IS still active
def test_active_loan_is_active(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    is_loan_active = contract.viewActiveLoans(lender, borrower)[10]
    assert is_loan_active is True


# Confirms that the proposed loan is NOT for sale after having been sold
def test_active_loan_is_for_sale(deploy_contract, buy_loan_fractional, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    buy_loan_fractional
    is_loan_for_sale = contract.viewActiveLoans(lender, borrower)[11]
    assert is_loan_for_sale is False
