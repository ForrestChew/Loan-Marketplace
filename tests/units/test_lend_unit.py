import brownie
from web3 import Web3
from brownie import accounts

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def test_lending_without_sending_funds(contract, propose_loan):
    lender = accounts[2]
    loan_proposal_id = contract.getLoanProposals()[0][1]
    with brownie.reverts("lend: Incorrect Amount"):
        contract.lend(loan_proposal_id, {"from": lender})


def test_lend_proposal_time_start(contract, lend):
    proposal_time_start = contract.getLoanProposals()[0][5]
    assert proposal_time_start > 1


def test_lend_proposal_new_lender_percent_of_loan(contract, lend):
    lender = accounts[2]
    proposal_id = contract.getLoanProposals()[0][1]
    lenders_percent_amount = contract.lenderPercentAmounts(lender, proposal_id)
    assert lenders_percent_amount == 100


def test_lend_proposal_new_lender_assigned_to_loan(contract, lend):
    lender = accounts[2]
    lenders_assigned_to_loan = contract.getLoanProposals()[0][7]
    assert lenders_assigned_to_loan[0] == lender


def test_lend_is_proposed(contract, lend):
    is_proposed = contract.getLoanProposals()[0][8]
    assert is_proposed == False


def test_lend_is_active(contract, lend):
    is_active = contract.getLoanProposals()[0][9]
    assert is_active == True


def test_lend_loan_made_to_proposer(lend):
    borrower = accounts[1]
    lender = accounts[2]
    assert borrower.balance() > lender.balance()


def test_emitted_lend_event(lend):
    emitted_lend_event = lend.events[0]
    assert emitted_lend_event


def test_emitted_lend_event_id(lend):
    emitted_proposal_event_id = lend.events[0]['id']
    assert emitted_proposal_event_id


def test_emitted_lend_event_id(lend):
    emitted_proposal_event_lender = lend.events[0]['lender']
    assert emitted_proposal_event_lender
