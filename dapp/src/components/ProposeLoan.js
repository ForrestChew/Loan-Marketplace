import { useMoralis } from 'react-moralis';
import abi from '../ABIs/abi';
import loansAddress from '../ABIs/address';

const ProposeLoan = () => {
    const { authenticate, user, enableWeb3, isWeb3Enabled } = useMoralis();
    const web3Enable = () => {
        const web3 = enableWeb3();
        const contract = new web3.eth.Contract(abi, loansAddress);
    }
    return (
        <>
           <h1 className='heading'>PROPOSE LOAN</h1>

        </>
    )
}

export default ProposeLoan
