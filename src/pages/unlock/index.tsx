import React from 'react';
import { walletConnectV2ProjectId } from '../../../config';
import { routeNames } from '../../../routes';
import { AuthRedirectWrapper } from '../../../components/AuthRedirectWrapper';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { CoinsProvider, useCoinContext } from 'helpers/CoinContext'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';
import utilStyles from '@/styles/utils.module.scss'

const ExtensionLoginButton = dynamic(
    async () => {
        return (
            await import('@multiversx/sdk-dapp/UI/extension/ExtensionLoginButton')
        ).ExtensionLoginButton;
    },
    {ssr: false}
);

const WebWalletLoginButton = dynamic(
    async () => {
        return (await import ('@multiversx/sdk-dapp/UI/webWallet/WebWalletLoginButton')
        ).WebWalletLoginButton;
    },
    { ssr:false }
);


const LedgerLoginButton = dynamic(
    async () => {
        return (await import('@multiversx/sdk-dapp/UI/ledger/LedgerLoginButton')
        ).LedgerLoginButton;
    },
    { ssr: false }
);


const UnlockPage = () => {

    const commonProps = {
        callbackRoute: routeNames.dashboard,
        nativeAuth: true
    };

    // const {balance, setBalance } = useCoinContext();
    // const router = useRouter();

    // const  coinBalance  = router.query.coinBalance === undefined ? 0 : +router.query.coinBalance;
    // setBalance(coinBalance);
    // console.log(coinBalance);

    return (
        < >
            
            <div className={utilStyles.centeredButtons}>
                <div className={utilStyles.chooseConnectionWrapper}>
                    Connect to your wallet
                    <span className={utilStyles.chooseConnectionText}>Choose one of the options below</span>
                </div>

                <ExtensionLoginButton loginButtonText='XPortal Chrome Extension' {...commonProps} className={utilStyles.connectOptionBtn}/>

                <WebWalletLoginButton loginButtonText='XPortal Web Wallet' {...commonProps} className={utilStyles.connectOptionBtn}/>

                <LedgerLoginButton loginButtonText='Ledger' {...commonProps} className={utilStyles.connectOptionBtn}/>

                <span className={utilStyles.createWalletText }>
                    Don`t have a wallet? <a href='https://devnet-wallet.multiversx.com/create' target='blank'>Create one here</a>
                </span>
              
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