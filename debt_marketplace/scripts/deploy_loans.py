from brownie import Loans, network, config
from scripts.utils import get_account

def deploy_loan_contract():
    account = get_account()
    contract = Loans.deploy({"from": account})
    print('Contract deployed!')
    return contract

def main():
    deploy_loan_contract()