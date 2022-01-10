import { useMoralis } from "react-moralis";


const CryptoLogin = () => {
    const { authenticate, isUnauthenticated } = useMoralis();
    return (
        <button 
        className="crypto-login"
        onClick={() => { 
            authenticate();
            console.log(isUnauthenticated);
        }}
        style={{float: 'right'}}
        >
            Crypto Login
        </button>
    )
}

export default CryptoLogin
