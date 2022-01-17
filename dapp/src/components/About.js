// import { useMoralis } from 'react-moralis';
// import abi from '../ABIs/abi';
// import loansAddress from '../ABIs/address';
const About = () => {

    // const getInfo = async () => {
    //     await Moralis.enableWeb3();
    //     const options = {
    //         abi: abi,
    //         contractAddress: loansAddress,
    //         chain: '1337',
    //         functionName: 'viewLoanProposals',
    //         params: {
    //             _borrower: user.get('ethAddress')
    //         }
    //     }
    //     const tx = await Moralis.executeFunction(options);
    //     console.log(tx)
    //     console.log(tx[0])
    // }
    return (
        <>
            <h1 className='heading'>ABOUT</h1>
            {/* <button onClick={() => test()}>click</button> */}
        </>
    )
}

export default About
