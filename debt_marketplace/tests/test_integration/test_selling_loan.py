# Tests that a lender can list any percent portion of a loan for any price.
# Tests use setup fixtures that can be found in conftest.py
import brownie
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


# Confirms that the lender can list 100% of loan for sale
def test_list_loan(deploy_contract, list_loan, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    list_loan
    assert contract.activeLoans(lender, borrower)[0] == w3.toWei(1, "ether")
    assert contract.activeLoans(lender, borrower)[1] == 5
    assert contract.activeLoans(lender, borrower)[2] == w3.toWei(0.05, "ether")
    # Multiplies the input number of days, which in this case is 10,
    # by 86,400 to get the number of seconds. The will help determine when the loan expires down the road.
    assert contract.activeLoans(lender, borrower)[3] == 10 * 86400
    # active loan struct field 4 is tested in lend tests
    assert contract.activeLoans(lender, borrower)[5] == w3.toWei(1, "ether")
    assert contract.activeLoans(lender, borrower)[6] == 100
    assert contract.activeLoans(lender, borrower)[7] == 0
    assert contract.activeLoans(lender, borrower)[8] == (
        "0x0000000000000000000000000000000000000000"
    )
    assert contract.activeLoans(lender, borrower)[9] == False
    assert contract.activeLoans(lender, borrower)[10] == True
    assert contract.activeLoans(lender, borrower)[11] == True


# Confirms that a lender can list a portion of a loan for sale
def test_list_fraction_of_loan(deploy_contract, list_fractional_loan, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    list_fractional_loan
    assert contract.activeLoans(lender, borrower)[0] == w3.toWei(1, "ether")
    assert contract.activeLoans(lender, borrower)[1] == 5
    assert contract.activeLoans(lender, borrower)[2] == w3.toWei(0.05, "ether")
    # Multiplies the input number of days, which in this case is 10,
    # by 86,400 to get the number of seconds. The will help determine when the loan expires down the road.
    assert contract.activeLoans(lender, borrower)[3] == 10 * 86400
    # active loan struct field 4 is tested in lend tests
    assert contract.activeLoans(lender, borrower)[5] == w3.toWei(0.5, "ether")
    assert contract.activeLoans(lender, borrower)[6] == 50
    assert contract.activeLoans(lender, borrower)[7] == 0
    assert contract.activeLoans(lender, borrower)[8] == (
        "0x0000000000000000000000000000000000000000"
    )
    assert contract.activeLoans(lender, borrower)[9] == False
    assert contract.activeLoans(lender, borrower)[10] == True
    assert contract.activeLoans(lender, borrower)[11] == True


# Confirms that a non active loan cannot be sold. This will cause a revert.
def test_list_loan_lender_reverts(deploy_contract, propose_loans, account):
    with brownie.reverts("You do not have the rights to sell this loan"):
        contract = deploy_contract
        propose_loans
        contract.listLoan(account, w3.toWei(0.5, "ether"), 5, {"from": accounts[3]})
