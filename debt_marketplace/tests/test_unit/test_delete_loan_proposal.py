# Tests the deleteLoanProposal function in the smart contract
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

# Confirms that the base loan amount is set to zero
def test_proposal_amount_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[0] == 0


# # Confirms that the loan interest percentage is set to zero
def test_interest_percent_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[1] == 0


# # Confrims thtat the loan interest amount is set to zero
def test_interest_amount_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[2] == 0


# # Confrims thtat the loan duration is set to zero
def test_loan_duration_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[3] == 0


# # Confirms that the loan's start timestamp is set to zero
def test_loan_start_timestamp_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[4] == 0


# # Confirms that the loan sale price is zero
def test_loan_for_sale_price_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[5] == 0


# # Confirms that the loan fraction percentage is zero
def test_loan_fraction_percentage_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[6] == 0


# # Confirms that the loan fraction amount is zero
def test_loan_fraction_amount_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[7] == 0


# # Confirms that the loan's fractional owner does not exist
def test_loan_fractional_owner_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert (
        contract.proposedLoans(borrower)[8]
        == "0x0000000000000000000000000000000000000000"
    )


# # Confirms that the loan is NOT proposed
def test_loan_is_not_proposed_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[9] is False


# # Confirms that the loan is NOT active
def test_loan_is_not_active_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[10] is False


# # Confirms that the loan is NOT for sale
def test_loan_is_not_for_sale_deletion(
    deploy_contract, delete_loan_proposal, account
):
    borrower = account
    contract = deploy_contract
    delete_loan_proposal
    assert contract.proposedLoans(borrower)[11] is False
