from brownie import LoanMarketplace
from scripts.utils import get_account


def deploy_loan_marketplace_contract():
    owner = get_account()
    listing_fee = 1
    contract = LoanMarketplace.deploy(owner, listing_fee, {"from": owner})
    print("Contract deployed....")
    return contract


def main():
    deploy_loan_marketplace_contract()
