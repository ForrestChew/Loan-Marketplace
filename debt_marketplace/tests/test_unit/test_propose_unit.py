# Tests that a loan proposal is created
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


# Confirms that the loan proposal amount matches loan_proposal fixture
def test_proposal_amount(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    loan_amount = contract.proposedLoans(account)[0]
    assert loan_amount == w3.toWei(1, "ether")


# Confirms that the loan proposal interest percent matches loan_proposal fixture
def test_interest_rate_percent(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    interest_percent = contract.proposedLoans(account)[1]
    assert interest_percent == 5


# Confirms that the loan proposal interest amount matches loan_proposal fixture
def test_interest_rate_amount(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    interest_amount = contract.proposedLoans(account)[2]
    assert interest_amount == w3.toWei(0.05, "ether")


# Confirms that the loan proposal duration matches loan_proposal fixture
def test_loan_duration(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    loan_duration = contract.proposedLoans(account)[3]
    # Multiplies the input number of days, which in this case is 10,
    # by 86,400 to get the number of seconds
    assert loan_duration == 10 * 86400


# Confirms that the loan proposal timestamp start matches loan_proposal fixture
def test_loan_timestamp(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    # Time stamp gets assigned when loan becomes active
    start_time_stamp = contract.proposedLoans(account)[4]
    assert start_time_stamp == 0


# Confirms that the loan proposal for sale price matches loan_proposal fixture
def test_loan_for_sale_price(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    for_sale_price = contract.proposedLoans(account)[5]
    assert for_sale_price == 0


# Confirms that the loan proposal amount matches loan_proposal fixture
def test_loan_fraction_percent(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    loan_fraction_percent = contract.proposedLoans(account)[6]
    assert loan_fraction_percent == 0


# Confirms that the loan proposal fraction amount matches loan_proposal fixture
def test_loan_fraction_amount(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    loan_fraction_amount = contract.proposedLoans(account)[7]
    assert loan_fraction_amount == 0


# Confirms that the loan proposal's fractional owner is the zero address
def test_loan_fractional_owner(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    loan_fractional_owner = contract.proposedLoans(account)[8]
    assert loan_fractional_owner == "0x0000000000000000000000000000000000000000"


# Confirms that the loan proposal IS proposed
def test_if_proposed(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    is_proposed = contract.proposedLoans(account)[9]
    assert is_proposed == True


# # Confirms that the loan proposal is NOT active
def test_is_active(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    is_active = contract.proposedLoans(account)[10]
    assert is_active == False


# Confirms that the loan proposal is NOT for sale
def test_is_for_sale(deploy_contract, propose_loans, account):
    contract = deploy_contract
    propose_loans
    is_for_sale = contract.proposedLoans(account)[11]
    assert is_for_sale == False
