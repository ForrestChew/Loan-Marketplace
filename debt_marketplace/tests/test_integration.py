import brownie
from brownie import accounts
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


def test_loans_deployment(deploy_contract):
    contract = deploy_contract
    assert contract.address is not None


class TestLoanProposals:
    def test_propose_loan(self, deploy_contract, propose_loans, account):
        # Builds propose loan transaction
        contract = deploy_contract
        # Uses fixture to propose loans
        propose_loans
        # Confirming that struct fields are equal to the correct struct fields
        assert contract.proposedLoans(account)[0] == w3.toWei(1, "ether")
        assert contract.proposedLoans(account)[1] == 5
        assert contract.proposedLoans(account)[2] == w3.toWei(0.05, "ether")
        assert contract.proposedLoans(account)[3] == 10
        assert contract.proposedLoans(account)[4] == 0
        assert contract.proposedLoans(account)[5] == 0
        assert contract.proposedLoans(account)[6] == 0
        assert contract.proposedLoans(account)[7] == 0
        assert contract.proposedLoans(account)[8] == (
            "0x0000000000000000000000000000000000000000"
        )
        assert contract.proposedLoans(account)[9] is True
        assert contract.proposedLoans(account)[10] is False
        assert contract.proposedLoans(account)[11] is False

    def test_propose_loan_reverts(self, deploy_contract, propose_loans, account):
        contract = deploy_contract
        # Proposes first loan
        propose_loans
        # Attempts to propse a second loan with an already active proposal
        with brownie.reverts("Account already has proposed loan or has active loan"):
            propose_loan_tx = contract.proposeLoan(
                w3.toWei(2, "ether"),
                w3.toWei(0.1, "ether"),
                30,  # days
                {"from": account},
            )
            propose_loan_tx.wait(1)


class TestLending:
    def test_lend(self, deploy_contract, propose_loans, lend, account):
        borrower = account
        lender = accounts[1]
        contract = deploy_contract
        # Popose loan from main account in order to lend
        propose_loans
        lend
        # collecting borrower's proposed loan struct fields with lender ownership
        assert contract.activeLoans(lender, borrower)[0] == w3.toWei(1, "ether")
        assert contract.activeLoans(lender, borrower)[1] == 5
        assert contract.activeLoans(lender, borrower)[2] == w3.toWei(0.05, "ether")
        assert contract.activeLoans(lender, borrower)[3] == 10  # days
        assert (
            contract.activeLoans(lender, borrower)[4]
            == w3.eth.get_block("latest").timestamp
        )
        assert contract.activeLoans(lender, borrower)[5] == 0
        assert contract.activeLoans(lender, borrower)[6] == 0
        assert contract.activeLoans(lender, borrower)[7] == 0
        assert contract.activeLoans(lender, borrower)[8] == (
            "0x0000000000000000000000000000000000000000"
        )
        assert contract.activeLoans(lender, borrower)[9] is False
        assert contract.activeLoans(lender, borrower)[10] is True
        assert contract.activeLoans(lender, borrower)[11] is False
        assert borrower.balance() == w3.toWei(101, "ether")
        assert lender.balance() == w3.toWei(99, "ether")

    def test_lend_reverts(self, deploy_contract, account):
        borrower = account
        lender = accounts[1]
        contract = deploy_contract
        with brownie.reverts("Account has no active loan proposals"):
            lend_tx = contract.lend(
                borrower, {"from": lender, "value": w3.toWei(1, "ether")}
            )
            lend_tx.wait(1)

    def test_loan_proposal_deletion(
        self, deploy_contract, propose_loans, lend, account
    ):
        borrower = account
        contract = deploy_contract
        propose_loans
        lend
        assert contract.proposedLoans(borrower)[0] == 0
        assert contract.proposedLoans(borrower)[1] == 0
        assert contract.proposedLoans(borrower)[2] == 0
        assert contract.proposedLoans(borrower)[3] == 0
        assert contract.proposedLoans(borrower)[3] == 0
        assert contract.proposedLoans(account)[5] == 0
        assert contract.proposedLoans(borrower)[6] == 0
        assert contract.proposedLoans(borrower)[7] == 0
        assert contract.proposedLoans(borrower)[8] == (
            "0x0000000000000000000000000000000000000000"
        )
        assert contract.proposedLoans(borrower)[9] is False
        assert contract.proposedLoans(borrower)[10] is False
        assert contract.proposedLoans(borrower)[11] is False


# Tests everything having to do with the payback functions
class TestPayback:
    def test_payback_non_fractional(
        self, deploy_contract, propose_loans, lend, account
    ):
        borrower = account
        lender = accounts[1]
        contract = deploy_contract
        initial_amount = contract.activeLoans(lender, borrower)[0]
        # Fractional will be equal to zero since this tests a non fractional loan
        fractional_amount = contract.activeLoans(lender, borrower)[2]
        total_amount = initial_amount + fractional_amount
        propose_loans
        lend
        contract.payback(lender, {"from": borrower, "value": total_amount})
        assert lender.balance() == w3.toWei(100.05, "ether")
        assert borrower.balance() == w3.toWei(99.95, "ether")

    # Confirms that the new debt owner gets paid back when borrower makes payment
    def test_fractional_loan_payback(
        self, deploy_contract, propose_loans, lend, account
    ):
        borrower = account
        lender = accounts[1]
        buyer = accounts[2]
        contract = deploy_contract
        propose_loans
        lend
        contract.listLoan(borrower, w3.toWei(0.5, "ether"), 50, {"from": lender})
        for_sale_price = contract.activeLoans(lender, borrower)[5]
        contract.buyLoan(lender, borrower, {"from": buyer, "value": for_sale_price})
        initial_amount = contract.activeLoans(lender, borrower)[0]
        fractional_amount = contract.activeLoans(lender, borrower)[7]
        total_amount = initial_amount + fractional_amount
        contract.payback(lender, {"from": borrower, "value": total_amount})
        assert borrower.balance() == w3.toWei(99.95, "ether")
        assert lender.balance() == w3.toWei(100.025, "ether")
        assert buyer.balance() == w3.toWei(100.025, "ether")

    def test_proposed_loan_is_active_reverts(self, deploy_contract, account):
        with brownie.reverts("Nonexistant loan cannot be paid back"):
            contract = deploy_contract
            contract.payback(
                accounts[1], {"from": account, "value": w3.toWei(1, "ether")}
            )

    def test_payback_amount_reverts(
        self, deploy_contract, propose_loans, lend, account
    ):
        with brownie.reverts("Amount paid back has to be exact"):
            contract = deploy_contract
            borrower = account
            lender = accounts[1]
            propose_loans
            lend
            contract.payback(lender, {"from": borrower, "value": w3.toWei(2, "ether")})


class TestSellingLoan:
    def test_list_loan(self, deploy_contract, propose_loans, lend, list_loan, account):
        borrower = account
        lender = accounts[1]
        contract = deploy_contract
        propose_loans
        lend
        list_loan
        assert contract.activeLoans(lender, borrower)[0] == w3.toWei(1, "ether")
        assert contract.activeLoans(lender, borrower)[1] == 5
        assert contract.activeLoans(lender, borrower)[2] == w3.toWei(0.05, "ether")
        assert contract.activeLoans(lender, borrower)[3] == 10
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
    def test_list_loan_lender_reverts(self, deploy_contract, propose_loans, account):
        with brownie.reverts("You do not have the rights to sell this loan"):
            contract = deploy_contract
            propose_loans
            contract.listLoan(account, w3.toWei(0.5, "ether"), 5, {"from": accounts[3]})


class TestBuyLoans:
    def test_buy_full_loan(
        self, deploy_contract, propose_loans, lend, buy_loan, list_loan, account
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

    def test_buy_loan_fraction(self, deploy_contract, propose_loans, lend, account):
        borrower = account
        lender = accounts[1]
        buyer = accounts[2]
        loan_list_price = w3.toWei(0.5, "ether")
        contract = deploy_contract
        propose_loans
        lend
        contract.listLoan(borrower, loan_list_price, 25, {"from": lender})
        contract.buyLoan(lender, borrower, {"from": buyer, "value": loan_list_price})
        assert contract.activeLoans(lender, borrower)[0] == w3.toWei(0.7875, "ether")
        assert contract.activeLoans(lender, borrower)[1] == 5
        assert contract.activeLoans(lender, borrower)[2] == w3.toWei(0.05, "ether")
        assert contract.activeLoans(lender, borrower)[3] == 10
        assert contract.activeLoans(lender, borrower)[4] != 0
        assert contract.activeLoans(lender, borrower)[5] == loan_list_price
        assert contract.activeLoans(lender, borrower)[6] == 25
        assert contract.activeLoans(lender, borrower)[7] == w3.toWei(0.2625, "ether")
        assert contract.activeLoans(lender, borrower)[8] == buyer
        assert contract.activeLoans(lender, borrower)[9] == False
        assert contract.activeLoans(lender, borrower)[10] == True
        assert contract.activeLoans(lender, borrower)[11] == False

    def test_buy_loan_no_active_loan_revert(
        self, deploy_contract, propose_loans, lend, account
    ):
        with brownie.reverts("Loan does not exist"):
            contract = deploy_contract
            propose_loans
            lend
            contract.buyLoan(accounts[1], account, {"from": accounts[2]})

    def test_buy_loan_wrong_amount_revert(
        self, deploy_contract, propose_loans, lend, list_loan, account
    ):
        with brownie.reverts("Not the correct amount of ether"):
            contract = deploy_contract
            propose_loans
            lend
            list_loan
            contract.buyLoan(
                accounts[1],
                account,
                {"from": accounts[2], "value": w3.toWei(0.5, "ether")},
            )
