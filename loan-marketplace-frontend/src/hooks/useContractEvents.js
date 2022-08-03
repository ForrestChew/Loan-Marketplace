import { useEffect } from "react";
import {
  getProvider,
  getContractInstance,
} from "../contract-info/contract-interactions";

export const useContractEvents = (fcToExectute) => {
  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("LoanProposalCreated", () => {
      fcToExectute();
    });
    return () => loanMarketplace.removeListener("LoanProposalCreated");
  }, []);
  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("Lend", () => {
      fcToExectute();
    });
    return () => loanMarketplace.removeListener("Lend");
  }, []);
  useEffect(() => {
    const loanMarketplace = getContractInstance(getProvider());
    loanMarketplace.on("DebtPaid", () => {
      fcToExectute();
    });
    return () => loanMarketplace.removeListener("DebtPaid");
  }, []);
};
