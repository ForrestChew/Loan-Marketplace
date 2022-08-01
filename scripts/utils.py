from brownie import accounts, network, config

TESTNET_BLOCKCHAIN_ENVIRONMENTS = ['rinkeby', 'kovan', 'mumbai']
LOCAL_BLOCKCHAIN_ENVIRONMENTS = ['Ganache-GUI']


def get_account():
    print(network.show_active())
    if network.show_active() in TESTNET_BLOCKCHAIN_ENVIRONMENTS or network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts.add(config["wallets"]['from_key'])
    print(config["wallets"]['from_key'])
    return accounts[0]
