import pytest
from brownie import accounts
from scripts.deploy_contract import deploy_loan_marketplace_contract


@pytest.fixture()
def contract():
    contract_instance = deploy_loan_marketplace_contract()
    return contract_instance


@pytest.fixture
def propose_loan(contract):
    loan_amount = 1
    interest_rate = 2
    loan_duration = 3
    borrower = accounts[1]
    proposal_tx = contract.proposeLoan(loan_amount, interest_rate, loan_duration, {
        "from": borrower, "value": 1})
    return proposal_tx


@pytest.fixture
def lend(contract, propose_loan):
    lender = accounts[2]
    propose_loan
    loan_proposal_id = contract.getLoanProposals()[0][1]
    loan_amount = contract.getLoanProposals()[0][2]
    lend_tx = contract.lend(
        loan_proposal_id, {"from": lender, "value": loan_amount})
    return lend_tx


@pytest.fixture
def payoff_debt_setup(contract):
    borrower = accounts[1]
    lender = accounts[2]
    listingFee = 1
    loan_amount = 10000
    interest_rate = 5
    contract.proposeLoan(loan_amount, interest_rate, 20, {
                         "from": borrower, "value": listingFee})
    proposal_id = contract.getLoanProposals()[0][1]
    lend_tx = contract.lend(proposal_id, {"from": lender, "value": 10000})
    return lend_tx


@pytest.fixture
def sell_loan_fraction(contract, payoff_debt_setup):
    lender = accounts[2]
    loan_id = contract.getLoanProposals()[0][1]
    sell_loan_fract_tx = contract.sellLoanFraction(
        loan_id, 1, 50, {"from": lender})
    return sell_loan_fract_tx


@pytest.fixture
def payoff_debt(contract, payoff_debt_setup):
    borrower = accounts[1]
    loan_amount = 10000
    interest_rate = 5
    interest_amount = (loan_amount * (interest_rate * 100)) / 10000
    total_debt = loan_amount + interest_amount
    proposal_id = contract.getLoanProposals()[0][1]
    payoff_debt_tx = contract.payoffDebt(
        proposal_id, {"from": borrower, "value": total_debt})
    return payoff_debt_tx
