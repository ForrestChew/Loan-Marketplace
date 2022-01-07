import { useMoralis } from 'react-moralis';
import abi from '../../ABIs/abi';
import loansAddress from '../../ABIs/address';

const BrowseLoans = () => {
    const { Moralis } = useMoralis();
    
    const viewLoans = async () => {
        const web3 = await Moralis.enableWeb3();
        const query = new Moralis.Query('Loan');
        const allLoans = await query.find();
        const loans = allLoans.map((loan) => {
            <h1 style={{color: 'red'}}>{loan.attributes.Amount}</h1>
        })
    }

    return (
        <>
            <h1 className='heading'>BROWSE LOANS</h1>
            <button onClick={() => viewLoans()}>View Loans</button>
            <h2>{loans}</h2>
        </>
    )
}

export default BrowseLoans
