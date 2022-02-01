import { useMoralis } from "react-moralis";

export const UserAddress = () => {
    const { logout, user } = useMoralis();
    const ethAddressStart = user.get('ethAddress').substring(0, 6);
    const ethAddressEnd = user.get('ethAddress').slice(-5);


    return (
        <>
            <button 
            className="crypto-login" 
            onClick={() => {
                logout();
            }}
            >
                {`${ethAddressStart}...${ethAddressEnd}`}
            </button>
        </>
    )
}

export default UserAddress