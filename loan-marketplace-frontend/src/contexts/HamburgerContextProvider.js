import { useState, createContext } from "react";

export const HamburgerContext = createContext();

const HamburgerContextProvider = ({ children }) => {
  const [hamMenuOpen, setHamMenuOpen] = useState(false);
  return (
    <HamburgerContext.Provider value={[hamMenuOpen, setHamMenuOpen]}>
      {children}
    </HamburgerContext.Provider>
  );
};

export default HamburgerContextProvider;
