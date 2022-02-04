# Tests that all struct fields for the active loan mapping are correct
# once the lend function is called.
# Tests use setup fixtures that can be found in conftest.py
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


# Confirms that an active loan is created with the correct amount
def test_active_amount(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    loan_amount = contract.activeLoans(accounts[1], account)[0]
    assert loan_amount == w3.toWei(1, "ether")


# Confirms that an active loan is created with the correct interest percent
def test_active_interest_percent(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    interest_rate_percent = contract.activeLoans(accounts[1], account)[1]
    assert interest_rate_percent == 5


# Confirms that an active loan is created with the correct interest amount
def test_active_interest_amount(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    interest_rate_amount = contract.activeLoans(accounts[1], account)[2]
    assert interest_rate_amount == w3.toWei(0.05, "ether")


# Confirms that an active loan is created with the correct loan duration
def test_active_loan_duration(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    active_loan_duration = contract.activeLoans(accounts[1], account)[3]
    # Multiplies the input number of days, which in this case is 10,
    # by 86,400 to get the number of seconds. The will help determine when the loan expires down the road.
    assert active_loan_duration == 10 * 86400


# Confirms that an active loan is created with the current timestamp logged to the loan.
def test_active_loan_timestamp_start(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    start_timestamp = contract.activeLoans(accounts[1], account)[4]
    assert start_timestamp == w3.eth.get_block("latest").timestamp


# Confirms that an active loan is created with the correct for sale price. Should be zero.
def test_active_sale_price(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    active_loan_sale_price = contract.activeLoans(accounts[1], account)[5]
    assert active_loan_sale_price == 0


# Confirms that an active loan is created with the correct loan fraction percentage. Should be zero.
def test_active_loan_fraction_percentage(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    loan_fraction_percentage = contract.activeLoans(accounts[1], account)[6]
    assert loan_fraction_percentage == 0


# Confirms that an active loan is created with the correct loan fraction amount. Should be zero.
def test_active_loan_fraction_amount(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    loan_fraction_amount = contract.activeLoans(accounts[1], account)[7]
    assert loan_fraction_amount == 0


# Confirms that an active loan is created with the correct loan fractional owner. None should exist.
def test_active_loan_fractional_owner(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    fractiona_owner = contract.activeLoans(accounts[1], account)[8]
    assert fractiona_owner == "0x0000000000000000000000000000000000000000"


# Confirms that an active loan is created and is no longer proposed.
def test_active_is_proposed(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    is_proposed = contract.activeLoans(accounts[1], account)[9]
    assert is_proposed == False


# Confirms that an active loan is created and is active.
def test_active_active(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    is_active = contract.activeLoans(accounts[1], account)[10]
    assert is_active == True


# Confirms that an active loan is created and is not for sale.
def test_active_loan_for_sale(deploy_contract, lend, account):
    contract = deploy_contract
    lend
    is_for_sale = contract.activeLoans(accounts[1], account)[11]
    assert is_for_sale == False
