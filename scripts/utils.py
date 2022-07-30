from brownie import accounts, network, config

BLOCKCHAIN_ENVIRONMENTS = ['rinkeby', 'kovan', 'mumbai']

def get_account():
    if network.show_active() in BLOCKCHAIN_ENVIRONMENTS:
        return accounts.add(config["wallets"]['from_key'])
    print(accounts[0])
    return accounts[0]