Borrowers can propose loans and lenders can fill them. If a proposal is filled, the lender has the right to sell that loan to a third party for a price in ether. This price is set by the lender. The lender also has the option to sell fraction of the loan. The lender gets to decide the percent fraction of the loan they want to sell, and for how much. At most, one fractional owner of a loan is allowed, and therefore, in it's current form, this project will not scale. When a third party buys a fraction of a loan, it is entirey possible that the borrower will never know. A borrower will not be notified if their loan has been sold to a third party, however, if they look up their loan, they will be able to find all information. In essence, the borrower is only given the "need to know" information about their loan. If a loan has multiple owners, the smart contract will hanlde distributing funds correctly to both the fractional buyer and the original lender.

This project depends heavily on Moralis's SDK and requires a Moralis server to function. A free account can be made -  https://moralis.io/
Also, this project overview assumes you have at least a basic understanding of MetaMask, but if you don't, here's a link to it's documentation - https://metamask.io/faqs/

*Note: 
This setup is done using the Avalanche Testnet Fuji, but any EVM compatible blockchain will work.*

# Setup steps <br>
### 1) Connect your MetaMask to the Avalanche Testnet Fuji: <br>
-   **Network Name**: Avalanche FUJI C-Chain <br>
-   **New RPC URL**:  https://api.avax-test.network/ext/bc/C/rpc <br>
-   **ChainID**:  43113<br>
-   **Symbol**:  AVAX<br>
-   **Explorer**:  https://testnet.snowtrace.io/ <br>

### 2) Create Moralis server on the Avalanche Test network:  <br>
Instructions can be found: https://docs.moralis.io/moralis-server/getting-started <br>
<br>
### 3) Clone repository <br>
```
git clone https://github.com/McManOfTheLand/Loan-Marketplace.git
```
### 4) Create .env files <br>
In the root of your project directory, create a .env file and add your Moralis Server URL and Application ID. 
![](readmePhotos/moralis_env_info.PNG)
<br>
In the projects debt_marketplace directory, add another .env file, but this time add your private key and your Web3 provider URL.
![](readmePhotos/private_key_and_provider_env.PNG)
<br>
### 5) Install node dependencies <br>
While in the project's root directory, run the command:
```
npm install
```
 ### 6)  Deploy Smart Contract <br>
 While in the project's root directory, run the command:
```
brownie run scripts/deploy_loans.py --network avax-testnet
```
 ### 7)  Connect smart contract to front end <br>
 In order to connect the projects front end with our smart contract, the contract's abi, and it's address are needed. Assuming that the contracts source code has not been modified, it's unnecessary to change it since it's already provided in the  **Loan-Marketplace/src/ContractInfo/abi.js** folder. In the same folder, there is a file called **address.js**. Add your contract instance address to the specified area.<br>
<br>
### 8) Launch dapp <br>
In project's root directory, run the command:<br>
```
npm start
```
Once open, you will see:
ADD PHOTO<br>

# Navigating the dapp <br>
 ### 1) Propose Loan <br>
 Users can make a loan proposal, but can have only one at most.
 ### 2) Browse Loans <br>  
 Users can view and fill loan proposals, but can only lend to one loan at a time. 
 ### 3) Browse Fractional Loans <br> 
 Users can view and buy fractions of loans. These fractions are sold by the lender to the original loan. 
 ### 4) Users Positions 
 If applicable, users can view or delete their loan proposals, view their fractional loans, and payback their active loans.
 

