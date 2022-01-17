import { useMoralis } from 'react-moralis';
import ABI from '../../ABIs/abi';
import loansAddress from '../../ABIs/address';
const FractionalStrip = ({
    amount, 
    interestRate, 
    interestAmount,
    duration, 
    borrower, 
    lender, 
    percentSold, 
    sellingPrice,
    id
}) => {

    const { Moralis, user } = useMoralis();

    const buyFullLoan = async () => {
        await Moralis.enableWeb3();
        // Isolates and converts selling price into a number
        const sellingPriceIso = sellingPrice.substring(21);
        const sellingPriceIsoToNum = parseFloat(sellingPriceIso);
        const ethInWei = Moralis.Units.ETH(sellingPriceIsoToNum);
        // Isolates borrower prop address
        const borrowerAddr = borrower.split(' ');
        console.log(borrowerAddr[1]);
        // Isolates lender prop address
        const lenderAddr = lender.split(' ');
        console.log(lenderAddr[1]);
        const buyFullLoan = {
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'buyLoan',
            msgValue: ethInWei,
            params: {
                _lender: lenderAddr[1],
                _borrower: borrowerAddr[1], 
            }
        }
        await Moralis.executeFunction(buyFullLoan);
        /* Since this function is only ran if lender is selling 100%
        of the loan, the "Lender" field in database will update
        with buyer's (new owner) address and resset loan fractions fields to 
        undefined*/ 
        const query = new Moralis.Query('ActivatedLoans');
        const queryToUpdate = await query.get(id);
        queryToUpdate.set('Lender', user.get('ethAddress'));
        queryToUpdate.set('PercentOfLoanSold', 'undefined');
        queryToUpdate.set('SellingPrice', 'undefined');
        await queryToUpdate.save();
    }

    const buyFractionalLoan = async () => {
        await Moralis.enableWeb3();
        // Isolates and converts selling price into a number
        const sellingPriceIso = sellingPrice.substring(21);
        const sellingPriceIsoToNum = parseFloat(sellingPriceIso);
        const ethInWei = Moralis.Units.ETH(sellingPriceIsoToNum);
        // Isolates borrower prop address
        const borrowerAddr = borrower.split(' ');
        console.log(borrowerAddr[1]);
        // Isolates lender prop address
        const lenderAddr = lender.split(' ');
        /* Isolates the base loan and interest rate amount strings, converts them into
        floats, calculates the total fractional loan amount, and passes it to the
        "buyLoanFraction" function parameter in smart contract */
        const amountIso = amount.substring(21);
        const amountIsoFloat = parseFloat(amountIso);
        console.log(amountIsoFloat);
        const interestAmountIso = interestAmount.substring(24);
        const interestAmountIsoFloat = parseFloat(interestAmountIso)
        console.log(interestAmountIsoFloat);
        const percentSoldIso = percentSold.substring(26);
        const percentSoldFloat = parseFloat(percentSoldIso);
        const totalLoanFractionAmount = ((amountIsoFloat + interestAmountIsoFloat) * percentSoldFloat) / 100;
        const totalLoanFractionAmountToWei = Moralis.Units.ETH(totalLoanFractionAmount);
        const newOwedAmount = (amountIsoFloat + interestAmountIsoFloat) - totalLoanFractionAmount;
        const newOwedAmountToWei = Moralis.Units.ETH(newOwedAmount);
        // Declares function call object
        const buyFractionalLoan = {
            abi: ABI,
            contractAddress: loansAddress,
            chain: '1337',
            functionName: 'buyLoanFraction',
            msgValue: ethInWei,
            params: {
                _lender: lenderAddr[1],
                _borrower: borrowerAddr[1],
                fractionalLoanAmount: totalLoanFractionAmountToWei,
                newBaseLoanAmount: newOwedAmountToWei
            }
        }
        await Moralis.executeFunction(buyFractionalLoan);
        const query = new Moralis.Query('ActivatedLoans');
        const queriedLoan = await query.get(id);
        queriedLoan.set('FractionalBuyersAddr', user.get('ethAddress'));
        await queriedLoan.save();
        console.log('Fractional Loan buys address saved')
    }

    return (
        <div className="strip-container">
            <li className="strip">
                {amount}
            </li>
            <li className="strip">
                {interestRate}
            </li>
            <li className="strip">
                {interestAmount}
            </li>
            <li className="strip">
                {duration}
            </li>
            <li className="strip">
                {borrower}
            </li>
            <li className="strip">
                {lender}
            </li>
            <li className="strip">
                {percentSold}
            </li>
            <li className="strip">
                {sellingPrice}
            </li>
            <button 
                className="btn" 
                onClick={
                    percentSold.split(' ')[5] === '100' ? 
                    () => buyFullLoan() : 
                    () => buyFractionalLoan()
                }
            >
                Buy
            </button>
        </div> 
    )
}

export default FractionalStrip
