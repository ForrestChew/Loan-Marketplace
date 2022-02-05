# Checks that the lender sends the correct amount of the
# ether, and that the borrower recieves the correct amount of ether
from brownie import accounts
from web3 import Web3

# using Ganache-cli as the provider
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


#Lender's balance is correct
def test_eth_sent(deploy_contract, lend):
    lender = accounts[1]
    deploy_contract
    lend
    # Confirms an decrease of one ETH to the lender ETH balance
    assert lender.balance() == w3.toWei(99, "ether")


#Borrower's balance is correct
def test_eth_recieved(deploy_contract, lend, account):
    borrower = account
    deploy_contract
    lend
    # Confirms an increase of one ETH to the borrowers ETH balance
    assert borrower.balance() == w3.toWei(101, "ether")
