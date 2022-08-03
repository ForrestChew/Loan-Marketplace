import { ethers } from "ethers";
import { contractAddress, contractABI } from "./contract-info";

const getProvider = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
};

const getSigner = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signerAddress = signer.getAddress();
  return { signer, signerAddress };
};

// Pass in a signer to get write access to the smart contract.
// Pass in a provider to get read only access to the smart contract.
const getContractInstance = (providerOrSigner) => {
  const contractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    providerOrSigner
  );
  return contractInstance;
};

const invokeProposeLoan = async (loanAmount, interestRate, duration) => {
  const listingFee = ethers.utils.parseEther("1");
  const { signer } = await getSigner();
  const contract = getContractInstance(signer);
  await contract.proposeLoan(loanAmount, interestRate, duration, {
    value: listingFee,
  });
};

const invokeLend = async (proposalId, loanAmount) => {
  const { signer } = await getSigner();
  const contract = getContractInstance(signer);
  await contract.lend(proposalId, { value: loanAmount });
};

const invokeSellLoanFraction = async (loanId, price, percentage) => {
  const { signer } = await getSigner();
  const contract = getContractInstance(signer);
  await contract.sellLoanFraction(loanId, price, percentage);
};

const callgetLoanProposals = async () => {
  const provider = getProvider();
  const contract = getContractInstance(provider);
  return await contract.getLoanProposals();
};

export {
  invokeProposeLoan,
  invokeLend,
  invokeSellLoanFraction,
  callgetLoanProposals,
  getContractInstance,
  getSigner,
  getProvider,
};
