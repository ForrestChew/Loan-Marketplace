# This script carries utility for other scripts.  
from brownie import accounts, network, config

ETHEREUM_BLOCKCHAIN_ENVIROMENTS = ["rinkeby", "kovan"]

# Gets account based on what network you are attempting to deploy smart contract to
def get_account():
    if network.show_active() in ETHEREUM_BLOCKCHAIN_ENVIROMENTS:
        return accounts.add(config["wallets"]["from_key"])
    # Returns the first Ganache account whe deploying to a local network
    return accounts[0]