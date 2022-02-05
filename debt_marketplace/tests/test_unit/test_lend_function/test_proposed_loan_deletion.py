# Confirms that the loan proposal is deleted once someone lends to it. 
# The proposal becomes an active loan. That's why the proposal is deleted.
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


# Confirms that the loan proposal amount is deleted 
def test_deleted_proposed_amount(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    loan_amount = contract.proposedLoans(account)[0]
    assert loan_amount == 0


# Confirms that the loan proposal interest percent is deleted
def test_deleted_proposed_interest_percent(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    interest_rate_percent = contract.proposedLoans(account)[1]
    assert interest_rate_percent == 0


# Confirms that the loan proposal interest amount is deleted
def test_deleted_proposed_interest_amount(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    interest_rate_amount = contract.proposedLoans(account)[2]
    assert interest_rate_amount == 0


# Confirms that the loan proposal duration is deleted
def test_deleted_proposed_loan_duration(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    active_loan_duration = contract.proposedLoans(account)[3]
    assert active_loan_duration == 0


# Confirms that the loan proposal timestamp start remains zero
def test_deleted_proposed_loan_timestamp_start(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    start_timestamp = contract.proposedLoans(account)[4]
    assert start_timestamp == 0


# Confirms that the loan proposal sale price remains zero
def test_deleted_proposed_sale_price(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    active_loan_sale_price = contract.proposedLoans(account)[5]
    assert active_loan_sale_price == 0


# Confirms that the loan proposal's fraction percentage remains zero
def test_deleted_proposed_fraction_percentage(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    loan_fraction_percentage = contract.proposedLoans(account)[6]
    assert loan_fraction_percentage == 0


# Confirms that the loan proposal's fraction amount remains zero
def test_deleted_proposed_fraction_amount(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    loan_fraction_amount = contract.proposedLoans(account)[7]
    assert loan_fraction_amount == 0


# Confirms that the loan proposal's fractionial owner is the zero address
def test_deleted_proposed_fractional_owner(deploy_contract, propose_loans, lend, account):
    contract = deploy_contract
    propose_loans
    lend
    fractiona_owner = contract.proposedLoans(account)[8]
    assert fractiona_owner == "0x0000000000000000000000000000000000000000"


# Confirms that the loan proposal is NOT proposed
def test_deleted_proposed_is_proposed(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    is_proposed = contract.proposedLoans(account)[9]
    assert is_proposed == False


# Confirms that the loan proposal is NOT active
def test_deleted_proposed_is_active(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    is_active = contract.proposedLoans(account)[10]
    assert is_active == False


# Confirms that the loan proposal is NOT for sale
def test_deleted_proposed_sale_price(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    is_for_sale = contract.proposedLoans(account)[11]
    assert is_for_sale == False
