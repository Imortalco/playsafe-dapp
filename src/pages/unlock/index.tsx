import React from 'react';
import { walletConnectV2ProjectId } from '../../../config';
import { routeNames } from '../../../routes';
import { AuthRedirectWrapper } from '../../../components/AuthRedirectWrapper';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { CoinsProvider, useCoinContext } from 'helpers/CoinContext'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';

const ExtensionLoginButton = dynamic(
    async () => {
        return (
            await import('@multiversx/sdk-dapp/UI/extension/ExtensionLoginButton')
        ).ExtensionLoginButton;
    },
    {ssr: false}
);

const WalletConnectLoginButton = dynamic(
    async () => {
        return (
            await import('@multiversx/sdk-dapp/UI/walletConnect/WalletConnectLoginButton')
        ).WalletConnectLoginButton;
    },
    {ssr: false}
);

const LedgerLoginButton = dynamic(
    async () => {
        return (await import('@multiversx/sdk-dapp/UI/ledger/LedgerLoginButton')
        ).LedgerLoginButton;
    },
    { ssr: false }
);

const WebWalletLoginButton = dynamic(
    async () => {
        return (await import ('@multiversx/sdk-dapp/UI/webWallet/WebWalletLoginButton')
        ).WebWalletLoginButton;
    },
    { ssr:false }
);


const UnlockPage = () => {
    const commonProps = {
        callbackRoute: routeNames.dashboard,
        nativeAuth: true

    };

    const {balance, setBalance } = useCoinContext();
    const router = useRouter();

    const  coinBalance  = router.query.coinBalance === undefined ? 0 : +router.query.coinBalance;
    setBalance(coinBalance);
    console.log(coinBalance);

    return (
        < >
            {/* <Head>
                <title>Next e bahti pumiqta</title>
            </Head> */}
            <div className='centeredButtons'>
                
                <ExtensionLoginButton loginButtonText='XPortal Chrome Extension' {...commonProps}/>

                <WebWalletLoginButton loginButtonText='XPortal Web Wallet' {...commonProps}/>

                <LedgerLoginButton loginButtonText='Ledger' {...commonProps}/>

                {/* <WalletConnectLoginButton 
                loginButtonText='WalletConnect Login' 
                {...commonProps}
                {...(walletConnectV2ProjectId ? {isWalletConnectV2: true} : {})}
                /> */}
            </div>
        </>
    )
};

export default function Unlock() {
    
    return (
        <AuthRedirectWrapper>
            <UnlockPage/>
        </AuthRedirectWrapper>
    )
}