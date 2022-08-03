from brownie import LoanMarketplace
from scripts.utils import get_account


def deploy_loan_marketplace_contract():
    owner = get_account()
    listing_fee = 1000000000000000000
    contract = LoanMarketplace.deploy(owner, listing_fee, {"from": owner})
    print(f"Contract deployed to: {contract.address}")
    return contract


def main():
    deploy_loan_marketplace_contract()


