from brownie import accounts, network, config

LOCAL_BLOCKCHAIN_ENVIROMENTS = ["development", "ganache-cli", "mainnet-fork"]

# Does not contain avax-test since it takes more effort to verify
# contract than any Ethereum based network
TESTNET_BLOCKCHAIN_ENVIROMENTS = ["rinkeby", "kovan"]

def get_account():
    if network.show_active() in TESTNET_BLOCKCHAIN_ENVIROMENTS:
        return accounts.add(config["wallets"]["from_key"])
    return accounts[0]