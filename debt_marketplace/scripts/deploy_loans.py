# This script is responsible for deploying smart contract to the blockchain
from brownie import Loans, network
from scripts.utils import ETHEREUM_BLOCKCHAIN_ENVIROMENTS
from scripts.utils import get_account

# Will programmatically verify smart contract on deployment 
# if the contract is deployed to an Ethereum network
publish_source = (
    True if network.show_active() in ETHEREUM_BLOCKCHAIN_ENVIROMENTS else False
)

# Deploys the smart contract from account. The get account function can be found in scripts/utils.py
def deploy_loan_contract():
    account = get_account()
    print(account)
    contract = Loans.deploy({"from": account}, publish_source=publish_source)
    print("Contract deployed!")
    return contract


def main():
    deploy_loan_contract()
