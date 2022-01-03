import { useMoralis } from "react-moralis";


const CryptoLogin = () => {
    const { authenticate } = useMoralis();
    return (
        <button 
        className="crypto-login"
        onClick={authenticate}
        >
            Crypto Login
        </button>
    )
}

export default CryptoLogin
