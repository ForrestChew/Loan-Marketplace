import { useMoralis } from 'react-moralis';
// Component will display if user IS logged in / authenticated.
export const UserAddress = () => {
  const { logout, user } = useMoralis();
  /*
  Extracts the first 5 digits, and the last 5 digits of an authenticated user's
  address to display. Othewise, the address would be too long and look awkward to dispaly.
  */
  const ethAddressStart = user.get('ethAddress').substring(0, 6);
  const ethAddressEnd = user.get('ethAddress').slice(-5);

  return (
    <>
      <button
        className='crypto-login'
        onClick={() => {
          logout();
        }}
      >
        {`${ethAddressStart}...${ethAddressEnd}`}
      </button>
    </>
  );
};

export default UserAddress;
