import brownie
from brownie import accounts


def test_buy_loan_fraction(contract, sell_loan_fraction):
    fract_seller = accounts[2]
    fract_buyer = accounts[3]
    loan_id = contract.getLoanProposals()[0][1]
    contract.buyLoanFraction(fract_seller, loan_id, {
                             "from": fract_buyer, "value": 1})
    lenders = contract.getLoanProposals()[0][7]
    assert lenders[0] == fract_seller
    assert lenders[1] == fract_buyer


def test_buy_loan_fraction_updates_fract_dist(contract, sell_loan_fraction):
    fract_seller = accounts[2]
    fract_buyer = accounts[3]
    loan_id = contract.getLoanProposals()[0][1]
    contract.buyLoanFraction(fract_seller, loan_id, {
                             "from": fract_buyer, "value": 1})
    buyer_percent_amt = contract.lenderPercentAmounts(fract_buyer, loan_id)
    seller_percent_amt = contract.lenderPercentAmounts(fract_seller, loan_id)
    assert buyer_percent_amt == 50
    assert seller_percent_amt == 50


def test_buy_loan_fraction_sale_deleted(contract, sell_loan_fraction):
    fract_seller = accounts[2]
    fract_buyer = accounts[3]
    loan_id = contract.getLoanProposals()[0][1]
    contract.buyLoanFraction(fract_seller, loan_id, {
                             "from": fract_buyer, "value": 1})
    loan_fract_sale = contract.fractionalSales(fract_seller, loan_id)
    assert loan_fract_sale[0] == 0
    assert loan_fract_sale[1] == 0
    assert loan_fract_sale[2] == 0
