import { useMoralis } from "react-moralis";
// Component will display if user is NOT logged in / authenticated.
const CryptoLogin = () => {
  const { authenticate } = useMoralis();
  return (
    <button
      className="crypto-login"
      // Logs in with MetaMask.
      onClick={() => {
        authenticate();
      }}
      style={{ float: "right" }}
    >
      Crypto Login
    </button>
  );
};

export default CryptoLogin;
