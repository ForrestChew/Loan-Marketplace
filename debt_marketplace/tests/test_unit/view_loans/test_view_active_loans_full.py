# This file tests the "viewActiveLoans" function within smart
# contract when the loan is NOT fractional
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

# Confirms that the loans inital amount matches the users input
def test_proposed_loan_amount(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    asking_loan_amount = contract.viewActiveLoans(lender, borrower)[0]
    assert asking_loan_amount == w3.toWei(1, "ether")


# Confirms that the loan matches percentage matches the users input
def test_proposed_loan_interest_percentage(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    loan_interest_percentage = contract.viewActiveLoans(lender, borrower)[1]
    assert loan_interest_percentage == 5


# Confirms that the loan's interest amount matches users input
def test_proposed_loan_interest_amount(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    loan_interest_amount = contract.viewActiveLoans(lender, borrower)[2]
    assert loan_interest_amount == w3.toWei(0.05, "ether")


# Confirms that the loan duration can, and is set to 10 days
def test_proposed_loan_duration(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    duration = contract.viewActiveLoans(lender, borrower)[3]
    # The number 10 is multiplied by 86400 to convert the days into seconds
    assert duration == 10 * 86400


# Comfirms that the current timestamp starts and is applied to the loan
def test_proposed_loan_timestamp_start(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    timestamp_start = contract.viewActiveLoans(lender, borrower)[4]
    assert timestamp_start == w3.eth.get_block("latest").timestamp


# Confirms that the for sale price of this loan is 0
def test_proposed_loan_for_sale_price(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    loan_for_sale_price = contract.viewActiveLoans(lender, borrower)[5]
    assert loan_for_sale_price == 0


# Confirms that the fractional split on the loan is 0
def test_proposed_loan_fractional_split(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    loan_fractional_split = contract.viewActiveLoans(lender, borrower)[6]
    assert loan_fractional_split == 0


# Confrims that the fractional loan amount is 0
def test_proposed_loan_fractional_amount(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    loan_fractional_amount = contract.viewActiveLoans(lender, borrower)[7]
    assert loan_fractional_amount == 0


# Confirms that there is NO fractional owner
def test_proposed_loan_fractional_owner(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    loan_fractional_owner = contract.viewActiveLoans(lender, borrower)[8]
    assert loan_fractional_owner == "0x0000000000000000000000000000000000000000"


# Confirms that the active loan IS NOT proposed
def test_proposed_loan_is_proposed(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    is_loan_proposed = contract.viewActiveLoans(lender, borrower)[9]
    assert is_loan_proposed is False


# Confirms that the active loan IS active  
def test_proposed_loan_is_active(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    is_loan_active = contract.viewActiveLoans(lender, borrower)[10]
    assert is_loan_active is True


# Confirms that the active loan is NOT for sale
def test_proposed_loan_is_for_sale(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    lend
    is_loan_for_sale = contract.viewActiveLoans(lender, borrower)[11]
    assert is_loan_for_sale is False
