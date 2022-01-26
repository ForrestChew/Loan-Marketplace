import brownie
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def test_list_loan(deploy_contract, propose_loans, lend, list_loan, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    propose_loans
    lend
    list_loan
    assert contract.activeLoans(lender, borrower)[0] == w3.toWei(1, "ether")
    assert contract.activeLoans(lender, borrower)[1] == 5
    assert contract.activeLoans(lender, borrower)[2] == w3.toWei(0.05, "ether")
    # Multiplies the input number of days, which in this case is 10,
    # by 86,400 to get the number of seconds
    assert contract.activeLoans(lender, borrower)[3] == 10 * 86400
    # active loan struct field 4 is tested in lend tests
    assert contract.activeLoans(lender, borrower)[5] == w3.toWei(1, "ether")
    assert contract.activeLoans(lender, borrower)[6] == 100
    # Calculates the fractional split amount if a lender wants to sell less than 100% of loan
    assert contract.activeLoans(lender, borrower)[7] == 0
    assert contract.activeLoans(lender, borrower)[8] == (
        "0x0000000000000000000000000000000000000000"
    )
    assert contract.activeLoans(lender, borrower)[9] == False
    assert contract.activeLoans(lender, borrower)[10] == True
    assert contract.activeLoans(lender, borrower)[11] == True


# Reverts since loan is not active
def test_list_loan_lender_reverts(deploy_contract, propose_loans, account):
    with brownie.reverts("You do not have the rights to sell this loan"):
        contract = deploy_contract
        propose_loans
        contract.listLoan(account, w3.toWei(0.5, "ether"), 5, {"from": accounts[3]})
