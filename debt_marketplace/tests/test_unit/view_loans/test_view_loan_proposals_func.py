# This file tests the "viewLoanProposals" function within smart contract
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


# Confirms that the loans inital amount matches the users input
def test_proposed_loan_amount(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    asking_loan_amount = contract.viewLoanProposals(borrower)[0]
    assert asking_loan_amount == w3.toWei(1, "ether")


# Confirms that the loan matches percentage matches the users input
def test_proposed_loan_interest_percentage(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    loan_interest_percentage = contract.viewLoanProposals(borrower)[1]
    assert loan_interest_percentage == 5


# Confirms that the loan's interest rate matches users input
def test_proposed_loan_interest_amount(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    loan_interest_amount = contract.viewLoanProposals(borrower)[2]
    assert loan_interest_amount == w3.toWei(0.05, "ether")


# Confirms that the loan duration can, and is set to 10 days
def test_proposed_loan_duration(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    duration = contract.viewLoanProposals(borrower)[3]
    # The number 10 is multiplied by 86400 to convert the days into seconds
    assert duration == 10 * 86400


# Comfirms that time stamp start is logged and saved to the loan
def test_proposed_loan_timestamp_start(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    timestamp_start = contract.viewLoanProposals(borrower)[4]
    # The time stamp is started once someone lends to loan so it can be a refrence
    # to when the loan should expire
    assert timestamp_start == 0


# Confirms that the for sale price of this loan is 0
def test_proposed_loan_for_sale_price(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    loan_for_sale_price = contract.viewLoanProposals(borrower)[5]
    assert loan_for_sale_price == 0


# Confirms that the fractional split on the loan is 0
def test_proposed_loan_fractional_split(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    loan_fractional_split = contract.viewLoanProposals(borrower)[6]
    assert loan_fractional_split == 0


# Confrims that the fractional loan amount is 0
def test_proposed_loan_fractional_amount(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    loan_fractional_amount = contract.viewLoanProposals(borrower)[7]
    assert loan_fractional_amount == 0


# Confirms that there is NO fractional owner
def test_proposed_loan_fractional_owner(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    loan_fractional_owner = contract.viewLoanProposals(borrower)[8]
    assert loan_fractional_owner == "0x0000000000000000000000000000000000000000"


# Confirms that the proposed loan IS proposed
def test_proposed_loan_is_proposed(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    is_loan_proposed = contract.viewLoanProposals(borrower)[9]
    assert is_loan_proposed is True


# Confirms that the proposed loan is NOT active - no one has lent to it yet
def test_proposed_loan_is_active(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    is_loan_active = contract.viewLoanProposals(borrower)[10]
    assert is_loan_active is False


# Confirms that the proposed loan is NOT for sale
def test_proposed_loan_is_for_sale(deploy_contract, propose_loans, account):
    borrower = account
    contract = deploy_contract
    propose_loans
    is_loan_for_sale = contract.viewLoanProposals(borrower)[11]
    assert is_loan_for_sale is False
