import { useMoralis } from 'react-moralis';
import abi from '../ABIs/abi';
import loansAddress from '../ABIs/address';

const BrowseLoans = () => {
    const { Moralis } = useMoralis();

    const viewLoan = async (borrower) => {
        const web3 = await Moralis.enableWeb3();
        console.log('Web3 instance ititialized')

        const options = { 
            abi: abi,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'viewLoanProposals',
            params: {
                _borrower: borrower
            }
        }
        const tx = await Moralis.executeFunction(options);
        const txObject = JSON.stringify(tx)
    }

    return (
        <>
            <h1 
                className='heading'>BROWSE LOANS</h1>
            <p onClick={() => viewLoan('0x6D0dE55F0267F7511145D6F153c678d0206F0043')}>a</p>
        </>
    )
}

export default BrowseLoans
