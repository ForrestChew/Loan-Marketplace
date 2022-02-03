from brownie import Loans, network
from scripts.utils import TESTNET_BLOCKCHAIN_ENVIROMENTS
from scripts.utils import get_account


publish_source = (
    True if network.show_active() in TESTNET_BLOCKCHAIN_ENVIROMENTS else False
)


def deploy_loan_contract():
    account = get_account()
    print(account)
    contract = Loans.deploy({"from": account}, publish_source=publish_source)
    print("Contract deployed!")
    return contract


def main():
    deploy_loan_contract()
