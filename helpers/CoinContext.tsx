import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

type cointContextType = {
    balance: number | undefined;
    setBalance: Dispatch<SetStateAction<number | undefined>> 
}

type Props = {
    children: ReactNode;
};

const coinContextDefaultValues: cointContextType = {
    balance: 10,
    setBalance: (balance) => {console.log(balance)},
};

const CoinContext = createContext<cointContextType>({
    balance: 10,
    setBalance: (): number => 0
});

export const useCoinContext = () => useContext(CoinContext);

export function CoinsProvider({children}: Props){
    const [balance, setBalance] = useState<number>();

    // const setBalance = (num: number) => {
    //     setCoinBalance(num);
    // };

    // const tempValues:cointContextType = {
    //     balance: coinBalance,
    //     setBalance: setBalance
    // };

    return  <>
        <CoinContext.Provider value={{balance, setBalance}} >
            {children}
        </CoinContext.Provider>
    </>;
}