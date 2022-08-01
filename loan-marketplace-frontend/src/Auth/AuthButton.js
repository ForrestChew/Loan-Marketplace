import { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import "./AuthButton.css";

const AuthButton = () => {
  const [shortAccount, setShortAccount] = useState(null);

  const { connect, status, account } = useMetaMask();

  useEffect(() => {
    if (account) {
      shortenAddress(account);
    } else {
      setShortAccount(null);
    }
  }, [account, status]);

  const connectAndSetAddress = async () => {
    await connect();
    shortenAddress(account);
  };

  const shortenAddress = (address) => {
    const addressBegining = address.substring(0, 4);
    const addressEnd = address.substring(37, 42);
    setShortAccount(
      addressBegining.concat(".".padEnd(4, ".")).concat(addressEnd)
    );
  };

  return (
    <>
      {!shortAccount ? (
        <button className="auth-btn" onClick={connectAndSetAddress}>
          Connect
        </button>
      ) : (
        <div>
          <p>{shortAccount}</p>
        </div>
      )}
    </>
  );
};

export default AuthButton;
