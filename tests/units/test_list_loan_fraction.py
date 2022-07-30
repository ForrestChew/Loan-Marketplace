import brownie
from brownie import accounts


def test_list_loan_fraction_more_than_owned(contract, lend):
    lender = accounts[2]
    loan_id = contract.getLoanProposals()[0][1]
    with brownie.reverts("sellLoanFraction: Cant sell more than owned"):
        contract.sellLoanFraction(loan_id, 1, 200, {"from": lender})


def test_list_loan_fraction(contract, sell_loan_fraction):
    lender = accounts[2]
    loan_id = contract.getLoanProposals()[0][1]
    fract_for_sale = contract.fractionalSales(lender, loan_id)
    assert fract_for_sale


def test_list_loan_fraction_id(contract, sell_loan_fraction):
    lender = accounts[2]
    loan_id = contract.getLoanProposals()[0][1]
    fract_for_sale_loan_id = contract.fractionalSales(lender, loan_id)[0]
    assert fract_for_sale_loan_id == loan_id


def test_list_loan_fraction_price(contract, sell_loan_fraction):
    lender = accounts[2]
    loan_id = contract.getLoanProposals()[0][1]
    fract_for_sale_loan_price = contract.fractionalSales(lender, loan_id)[1]
    assert fract_for_sale_loan_price == 1


def test_list_loan_fraction_percent(contract, sell_loan_fraction):
    lender = accounts[2]
    loan_id = contract.getLoanProposals()[0][1]
    fract_for_sale_loan_percent = contract.fractionalSales(lender, loan_id)[2]
    assert fract_for_sale_loan_percent == 50


def test_list_loan_fraction_emitted_id(contract, sell_loan_fraction):
    loan_id = contract.getLoanProposals()[0][1]
    emitted_fraction_listing_id = sell_loan_fraction.events[0]['loanId']
    assert loan_id == emitted_fraction_listing_id


def test_list_loan_fraction_emitted_percentage(sell_loan_fraction):
    emitted_fraction_listing_percentage = sell_loan_fraction.events[0]['percentage']
    assert emitted_fraction_listing_percentage == 50


def test_list_loan_fraction_emitted_price(sell_loan_fraction):
    emitted_fraction_listing_price = sell_loan_fraction.events[0]['price']
    assert emitted_fraction_listing_price == 1
