from typing import List
from _pytest.fixtures import yield_fixture
from brownie.network import contract
import pytest
import brownie
from brownie import Loans, accounts
from scripts.utils import get_account
from web3 import Web3 as w3

@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass

@pytest.fixture
def account():
    account = get_account()
    return account

@pytest.fixture
def deploy_contract(account):
    contract = Loans.deploy({"from": account})
    return contract

@pytest.fixture
def propose_loans(deploy_contract, account):
    contract = deploy_contract
    propose_loan_tx = contract.proposeLoan(
        w3.toWei(1, "ether"),
        5,
        10, #days
        {"from": account}
    )
    return propose_loan_tx

@pytest.fixture
def lend(deploy_contract, propose_loans, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    #Popose loan from main account in order to lend
    propose_loans
    loan_amount = contract.proposedLoans(borrower)[0]
    lend_tx = contract.lend(
        borrower, 
        {
            "from": lender,
            "value": loan_amount
        }    
    )
    return lend_tx

@pytest.fixture()
def payback(deploy_contract, propose_loans, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    propose_loans
    lend
    amount_borrowed = contract.activeLoans(lender, borrower)[0]
    amount_borrowed_interest = contract.activeLoans(lender, borrower)[1]
    total_debt = amount_borrowed + amount_borrowed_interest
    contract.payback(lender, {"from": borrower, "value": total_debt})

@pytest.fixture
def list_loan(deploy_contract, propose_loans, lend, account):
    borrower = account
    lender = accounts[1]
    contract = deploy_contract
    propose_loans
    lend
    list_loan_tx = contract.listLoan(borrower, w3.toWei(1, "ether"), {"from": lender})
    return list_loan_tx

@pytest.fixture
def buy_loan(deploy_contract, propose_loans, lend, list_loan, account):
    contract = deploy_contract
    borrower = account
    lender = accounts[1]
    buyer = accounts[2]
    propose_loans
    lend
    list_loan
    loan_price = contract.activeLoans(lender, borrower)[3]
    buy_loan_tx = contract.buyLoan(lender, borrower, {"from": buyer, "value": loan_price})
    return buy_loan_tx

def test_loans_deployment(deploy_contract):
    contract = deploy_contract
    assert contract.address is not None

class TestLoanProposals():
    def test_propose_loan(self, deploy_contract, propose_loans, account):
        #Builds propose loan transaction
        contract = deploy_contract
        #Uses fixture to propose loans
        propose_loans
        #Confirming that struct fields are equal to the correct struct fields
        proposed_loan_amount = contract.proposedLoans(account)[0]
        proposed_loan_rate = contract.proposedLoans(account)[1]
        proposed_loan_duration = contract.proposedLoans(account)[2]
        proposed_loan_sale_price = contract.proposedLoans(account)[3]
        proposed_loan_proposed = contract.proposedLoans(account)[4]
        propose_loans_active = contract.proposedLoans(account)[5]
        propose_loans_for_sale = contract.proposedLoans(account)[6]
        assert proposed_loan_amount == w3.toWei(1, "ether")
        assert proposed_loan_rate == w3.toWei(0.05, "ether")
        assert proposed_loan_duration == 10
        assert proposed_loan_sale_price == 0
        assert proposed_loan_proposed is True
        assert propose_loans_active is False
        assert propose_loans_for_sale is False

    def test_propose_loan_reverts(self, deploy_contract, propose_loans, account):
        contract = deploy_contract
        #Proposes first loan
        propose_loans
        #Attempts to propse a second loan with an already active proposal
        with brownie.reverts("Account already has proposed loan or has active loan"):
            propose_loan_tx = contract.proposeLoan(
            w3.toWei(2, "ether"),
            w3.toWei(0.1, "ether"),
            30, #days
            {"from": account}
        )
            propose_loan_tx.wait(1)

class TestLending():
    def test_lend(self, deploy_contract, propose_loans, lend, account):
        borrower = account
        lender = accounts[1]
        contract = deploy_contract
        #Popose loan from main account in order to lend
        propose_loans
        lend
        #collecting borrower's proposed loan struct fields with lender ownership
        lender_ownership_amount = contract.activeLoans(lender, borrower)[0]
        lender_ownership_rate = contract.activeLoans(lender, borrower)[1]
        lender_ownership_duration = contract.activeLoans(lender, borrower)[2]
        lender_ownership_sale_price = contract.activeLoans(lender, borrower)[3]
        lender_ownership_proposed = contract.activeLoans(lender, borrower)[4]
        lender_ownership_active = contract.activeLoans(lender, borrower)[5]
        assert lender_ownership_amount == w3.toWei(1, "ether")
        assert lender_ownership_rate == w3.toWei(0.05, "ether")
        assert lender_ownership_duration == 10 #days
        assert lender_ownership_sale_price == 0
        assert lender_ownership_proposed is False
        assert lender_ownership_active is True
        assert borrower.balance() == w3.toWei(101, "ether")
        assert lender.balance() == w3.toWei(99, "ether")

    def test_lend_reverts(self, deploy_contract, account):
        borrower = account
        lender = accounts[1]
        contract = deploy_contract
        with brownie.reverts("Account has no active loan proposals"):
            lend_tx = contract.lend(
            borrower, 
            {
                "from": lender,
                "value": w3.toWei(1, "ether")
            }    
        )
            lend_tx.wait(1)

    def test_loan_proposol_deletion(self, deploy_contract, propose_loans, lend, account):
        borrower = account
        lender = accounts[1]
        contract = deploy_contract
        #Popose loan from main account in order to lend
        propose_loans
        lend
        proposed_loans_amount = contract.proposedLoans(borrower)[0]
        proposed_loans_interest_rate = contract.proposedLoans(borrower)[1]
        proposed_loans_duration = contract.proposedLoans(borrower)[2]
        proposed_loans_sale_price = contract.proposedLoans(borrower)[3]
        proposed_loans_proposed = contract.proposedLoans(borrower)[4]
        proposed_loans_active = contract.proposedLoans(borrower)[5]
        proposed_loans_for_sale = contract.proposedLoans(borrower)[6]
        assert proposed_loans_amount == 0
        assert proposed_loans_interest_rate == 0
        assert proposed_loans_duration == 0
        assert proposed_loans_sale_price == 0
        assert proposed_loans_proposed is False
        assert proposed_loans_active is False 
        assert proposed_loans_for_sale is False

#Tests everything having to do with the payback functions
class TestPayback():
    def test_payback(self, deploy_contract, propose_loans, lend, payback, account):
        borrower = account
        lender = accounts[1]
        deploy_contract
        propose_loans
        lend
        payback
        assert lender.balance() == w3.toWei(100.05, "ether")
        assert borrower.balance() == w3.toWei(99.95, "ether")

    #Confirms that the new debt owner gets paid back when borrower makes payment
    def test_sold_debt_payback(
        self, 
        deploy_contract, 
        propose_loans, 
        lend,
        list_loan, 
        buy_loan, 
        account
    ):
        borrower = account
        accounts[1]
        buyer = accounts[2]
        contract = deploy_contract
        propose_loans
        lend
        list_loan
        buy_loan
        contract.payback(buyer, {"from": borrower, "value": w3.toWei(1.05, "ether")})
        assert buyer.balance() == w3.toWei(100.05, "ether")
        assert borrower.balance() == w3.toWei(99.95, "ether")

    def test_proposed_loan_is_active_reverts(self, deploy_contract, account):
        with brownie.reverts("Nonexistant loan cannot be paid back"):
            contract = deploy_contract
            contract.payback(
                accounts[1], 
                {
                    "from": account, 
                    "value": w3.toWei(1, "ether")
                }
            )

    def test_payback_amount_reverts(self, deploy_contract, propose_loans, lend, account):
        with brownie.reverts("Amount paid back has to be exact"):
            contract = deploy_contract
            borrower = account
            lender = accounts[1]
            propose_loans
            lend
            contract.payback(lender, {"from": borrower, "value": w3.toWei(2, "ether")})

class TestSellingLoan():
    def test_list_loan(self, deploy_contract, propose_loans, lend, list_loan, account):
        borrower = account
        lender = accounts[1]
        contract = deploy_contract
        propose_loans
        lend
        list_loan
        lender_ownership_sale_price = contract.activeLoans(lender, borrower)[3]
        lender_ownership_for_sale = contract.activeLoans(lender, borrower)[6]
        assert lender_ownership_sale_price == w3.toWei(1, "ether")
        assert lender_ownership_for_sale == True

    #Reverts since loan is not active
    def test_list_loan_lender_reverts(self, deploy_contract, propose_loans, account):
        with brownie.reverts("You do not have the rights to sell this loan"):
            contract = deploy_contract
            propose_loans
            contract.listLoan(
                account,
                w3.toWei(0.5, "ether"),
                {"from": accounts[3]}
            )

class TestBuyLoans():
    def test_buy_loans(
        self, 
        deploy_contract, 
        propose_loans, 
        lend,
        buy_loan, 
        list_loan, 
        account
    ):
        borrower = account
        lender = accounts[1]
        buyer = accounts[2]
        contract = deploy_contract
        propose_loans
        lend
        list_loan
        buy_loan
        #Confirms that transaction by viewing the seller and buyers ETH balances after function call
        assert lender.balance() == w3.toWei(100, "ether")
        assert buyer.balance() == w3.toWei(99, "ether")
        #Confirms that buyer now has ownership over the borrower to that loan       
        assert contract.activeLoans(buyer, borrower)[0] == w3.toWei(1, "ether")
        assert contract.activeLoans(buyer, borrower)[1] == w3.toWei(0.05, "ether")
        assert contract.activeLoans(buyer, borrower)[2] == 10
        assert contract.activeLoans(buyer, borrower)[3] == 0
        assert contract.activeLoans(buyer, borrower)[4] == False
        assert contract.activeLoans(buyer, borrower)[5] == True
        assert contract.activeLoans(buyer, borrower)[6] == False
        #Confirm that the original lender no longer has rights to the sold loan
        assert contract.activeLoans(lender, borrower)[0] == 0
        assert contract.activeLoans(lender, borrower)[1] == 0
        assert contract.activeLoans(lender, borrower)[2] == 0
        assert contract.activeLoans(lender, borrower)[3] == 0
        assert contract.activeLoans(lender, borrower)[4] == False
        assert contract.activeLoans(lender, borrower)[5] == False
        assert contract.activeLoans(lender, borrower)[6] == False

    def test_buy_loan_no_active_loan_revert(
        self, 
        deploy_contract, 
        propose_loans, 
        lend, 
        account
    ):
        with brownie.reverts("Loan either does not exist or is not for sale"):
            contract = deploy_contract
            propose_loans
            lend
            contract.buyLoan(accounts[1], account, {"from": accounts[2]})
    
    def test_buy_loan_wrong_amount_revert(
        self, 
        deploy_contract, 
        propose_loans, 
        lend, 
        list_loan,
        account
    ):
        with brownie.reverts("Loan either does not exist or is not for sale"):
            contract = deploy_contract
            propose_loans
            lend
            list_loan
            contract.buyLoan(
                accounts[1], 
                account, 
                {
                    "from": accounts[2],
                    "value": w3.toWei(0.5, "ether")    
                }
            )

            