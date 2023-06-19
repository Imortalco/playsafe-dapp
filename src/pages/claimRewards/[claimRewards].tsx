'use client';

import utilStyles from '@/styles/utils.module.scss'
import BalanceInfo  from '../../../components/Layout/balanceinfo'
import { faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

import { Interaction, TokenTransfer } from "@multiversx/sdk-core";
import { GasEstimator, TransferTransactionsFactory } from "@multiversx/sdk-core";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";


import { Account,Address, IAddress, INonce } from "@multiversx/sdk-core";

import { CoinsProvider, useCoinContext } from 'helpers/CoinContext'
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ClaimRewards() {
    const [currencyAmount, setCurrencyAmount] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);
    const { address, account} = useGetAccountInfo();
    const [ receiverAddress, setReceiverAddress] = useState<Address>(new Address(''));
    const [balance, setBalance ] = useState<number>(0);
    const  [, setTransactionSessionId] = useState<
    string | null>
    (null);

    const router = useRouter();
    const claimRewardsBalance = router.query.claimRewards === undefined ? 0 : +router.query.claimRewards;

    let ownerAddress = new Address(account.address);

    const updateCurrencyAmount = (event:any) => {
        setCurrencyAmount(event.target.value);
        setTokenAmount(event.target.value/2);
      }
    
      const updateTokenAmount = (event:any) => {
        setTokenAmount(event.target.value);
        setCurrencyAmount(event.target.value*2);
      }

    const tokenTransfer = async () => {
        const factory = new TransferTransactionsFactory(new GasEstimator());
        const esdtTransfer = TokenTransfer.fungibleFromAmount('PSF-36ce19', tokenAmount , 18);
    
        const esdtTransaction = factory.createESDTTransfer({
        tokenTransfer: esdtTransfer,
        nonce: 7,
        receiver: receiverAddress,
        sender: ownerAddress,
        chainID: "D",
        });
    
        const { sessionId } = await sendTransactions({
        transactions: esdtTransaction,
        transactionsDisplayInfo : {
            proccessingMessage: 'Proccessing trans ...',
            errorMessage: 'Da go duhash',
            successMessage: 'Qydeeee'
        },
        redirectAfterSign: false,
        skipGuardian: true,
        });

        await refreshAccount();

        if(sessionId != null) {
          setTransactionSessionId(sessionId);
        }
  }

    return <>
    <BalanceInfo></BalanceInfo>
    <div className='container py-4'>
      <div className='row'>
        <div className='col-12 col-md-10 mx-auto'>
          <div className={`${utilStyles.cardSmall} card shadow-sm `}>  
              <div className={utilStyles.inputWrapper}>
                <div className={utilStyles.whiteText}>
                  <span>Your balance: 
                    <br></br>
                    {claimRewardsBalance} Points
                  </span>
                </div>
                <div className={utilStyles.currencyFields}>
                  <label className={utilStyles.currencyLabel} htmlFor={utilStyles.currencyInput}>Points</label>
                  <input className={utilStyles.currencyInput} type='number' min='0' value={currencyAmount} onChange={updateCurrencyAmount}/>
                </div>
                <div className={utilStyles.iconWrapper}>
                  <FontAwesomeIcon icon={faArrowUp } bounce style={{color:"#ffffff"}} />
                  <FontAwesomeIcon icon={faArrowDown } bounce style={{color:"#ffffff"}} />
                </div>
                <div className={utilStyles.tokenFields}>
                  <label className={utilStyles.tokenLabel} htmlFor={utilStyles.tokenInput}>PlaySafe Tokens</label>
                  <input className={utilStyles.tokenInput} type='number' min='0' value={tokenAmount} onChange={updateTokenAmount}/>
                </div>
                <button className={utilStyles.claimBtn} onClick={tokenTransfer}>Claim</button>
              </div>
            </div>
          </div>
      </div>
    </div> 
    </>
}