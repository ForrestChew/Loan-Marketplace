import brownie
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def test_buy_full_loan(
    deploy_contract, propose_loans, lend, buy_loan, list_loan, account
):
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    contract = deploy_contract
    propose_loans
    lend
    list_loan
    buy_loan
    fractional_owner = "0x0000000000000000000000000000000000000000"
    # Confirms transaction success by viewing the seller and buyers ETH balances after function call
    assert lender.balance() == w3.toWei(100, "ether")
    assert buyer.balance() == w3.toWei(99, "ether")
    # Confirms that buyer now has ownership over the borrower to that loan
    assert contract.activeLoans(buyer, borrower)[0] == w3.toWei(1, "ether")
    assert contract.activeLoans(buyer, borrower)[1] == 5
    assert contract.activeLoans(buyer, borrower)[2] == w3.toWei(0.05, "ether")
    assert contract.activeLoans(buyer, borrower)[3] == 10
    # active loan struct field 4 is tested in lend tests
    assert contract.activeLoans(buyer, borrower)[5] == 0
    # The loan fraction amount only calculates when the loan is owned by two parties.
    # E.G. the loan percentage is less than 100
    assert contract.activeLoans(buyer, borrower)[7] == 0
    assert contract.activeLoans(buyer, borrower)[8] == fractional_owner
    assert contract.activeLoans(buyer, borrower)[9] == False
    assert contract.activeLoans(buyer, borrower)[10] == True
    assert contract.activeLoans(buyer, borrower)[11] == False
    # Confirms that the original lender no longer has rights to the sold loan
    assert contract.activeLoans(lender, borrower)[0] == 0
    assert contract.activeLoans(lender, borrower)[1] == 0
    assert contract.activeLoans(lender, borrower)[2] == 0
    assert contract.activeLoans(lender, borrower)[3] == 0
    assert contract.activeLoans(lender, borrower)[4] == False
    assert contract.activeLoans(lender, borrower)[5] == False
    assert contract.activeLoans(lender, borrower)[6] == False


# Tests buying a fractional loan
def test_buy_loan_fraction(deploy_contract, propose_loans, lend, account):
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    loan_list_price = w3.toWei(0.5, "ether")
    contract = deploy_contract
    propose_loans
    lend
    contract.listLoan(borrower, loan_list_price, 25, {"from": lender})
    loan_fraction_percent = contract.activeLoans(lender, borrower)[6]
    # Calculates the fractional amount to pass the smart contract as a parameter
    fractional_amount = (
        contract.activeLoans(lender, borrower)[0] * loan_fraction_percent
    ) / (100 * 10 ** 18)
    # Converts the amount to wei
    fractional_amount_wei = w3.toWei(fractional_amount, "ether")
    new_base_loan = contract.activeLoans(lender, borrower)[0] - fractional_amount_wei
    contract.buyLoanFraction(
        lender,
        borrower,
        fractional_amount_wei,
        new_base_loan,
        {"from": buyer, "value": loan_list_price},
    )
    assert contract.activeLoans(lender, borrower)[0] == new_base_loan
    assert contract.activeLoans(lender, borrower)[1] == 5
    assert contract.activeLoans(lender, borrower)[2] == w3.toWei(0.05, "ether")
    assert contract.activeLoans(lender, borrower)[3] == 10
    assert contract.activeLoans(lender, borrower)[4] != 0
    assert contract.activeLoans(lender, borrower)[5] == loan_list_price
    assert contract.activeLoans(lender, borrower)[6] == 25
    assert contract.activeLoans(lender, borrower)[7] == w3.toWei(
        fractional_amount, "ether"
    )
    assert contract.activeLoans(lender, borrower)[8] == buyer
    assert contract.activeLoans(lender, borrower)[9] == False
    assert contract.activeLoans(lender, borrower)[10] == True
    assert contract.activeLoans(lender, borrower)[11] == False


def test_buy_loan_no_active_loan_revert(deploy_contract, propose_loans, lend, account):
    with brownie.reverts("non-existant"):
        contract = deploy_contract
        propose_loans
        lend
        contract.buyLoan(accounts[1], account, {"from": accounts[2]})


def test_buy_loan_wrong_amount_revert(
    deploy_contract, propose_loans, lend, list_loan, account
):
    with brownie.reverts("Incorrect ether amt"):
        contract = deploy_contract
        propose_loans
        lend
        list_loan
        contract.buyLoan(
            accounts[1],
            account,
            {"from": accounts[2], "value": w3.toWei(0.5, "ether")},
        )
