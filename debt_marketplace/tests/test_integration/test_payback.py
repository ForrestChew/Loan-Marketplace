# Tests the payback functionallity of the smart contract.
import brownie
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

# Tests that a borrower can payback a lender when the loan, or portions
# of that loan have not been sold by the lender
def test_payback_non_fractional(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    total_amount = (
        contract.activeLoans(lender, borrower)[0] 
        + contract.activeLoans(lender, borrower)[2]
    )
    lend
    contract.payback(lender, {"from": borrower, "value": total_amount})
    assert lender.balance() == w3.toWei(100.05, "ether")
    assert borrower.balance() == w3.toWei(99.95, "ether")


# Confirms that when a portion of the loan has been sold, the correct amount of ETH
# is paid pack to both the original lender, and the fractional buyer.
def test_fractional_loan_payback(deploy_contract, lend, account):
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    contract = deploy_contract
    lend
    contract.listLoan(borrower, w3.toWei(0.5, "ether"), 50, {"from": lender})
    # Defines variables for readability
    base_loan_amount = contract.activeLoans(lender, borrower)[0]
    interest_rate_amount = contract.activeLoans(lender, borrower)[2]
    loan_fraction_percentage = contract.activeLoans(lender, borrower)[6]
    fractional_for_sale_price = contract.activeLoans(lender, borrower)[5]
    # Calculates the fractional loan amount
    total_loan_fraction_amount = (
        (base_loan_amount + interest_rate_amount)
        * loan_fraction_percentage
        / (100 * 10 ** 18)
    )
    # Converts result of total_loan_fraction_amount into wei
    total_loan_fraction_amount_wei = w3.toWei(total_loan_fraction_amount, "ether")
    # Finds the new base loan amount by subtracting the 
    # total_loan_fraction_amount_wei from it
    new_base_loan_amount = (
        base_loan_amount + interest_rate_amount
    ) - total_loan_fraction_amount_wei
    # Buys loan with new amount fields
    contract.buyLoanFraction(
        lender,
        borrower,
        total_loan_fraction_amount_wei,
        new_base_loan_amount,
        {"from": buyer, "value": fractional_for_sale_price},
    )
    contract.payback(
        lender,
        {
            "from": borrower,
            "value": new_base_loan_amount + total_loan_fraction_amount_wei,
        },
    )
    # Confirms that the balances of anyone who has stake in the loan are correct.
    assert borrower.balance() == w3.toWei(99.95, "ether")
    assert lender.balance() == w3.toWei(100.025, "ether")
    assert buyer.balance() == w3.toWei(100.025, "ether")


# Confirms that an active loan that doesn't exist cannot be paid back.
def test_proposed_loan_is_active_reverts(deploy_contract, account):
    with brownie.reverts("Nonexistant loan cannot be paid back"):
        contract = deploy_contract
        contract.payback(accounts[1], {"from": account, "value": w3.toWei(1, "ether")})


# Confirms that the amount a loan is paid back has to be exact.
def test_payback_amount_reverts(deploy_contract, lend, account):
    with brownie.reverts("Amount paid back must be exact"):
        contract = deploy_contract
        borrower = account
        lender = accounts[1]
        lend
        contract.payback(lender, {"from": borrower, "value": w3.toWei(2, "ether")})
