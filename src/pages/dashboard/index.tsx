import Utils from 'components/Utils/utitls';
import utilStyles from '@/styles/utils.module.scss'

import { useState } from 'react';
import { faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';


import { Interaction, TokenTransfer } from "@multiversx/sdk-core";
import { GasEstimator, TransferTransactionsFactory } from "@multiversx/sdk-core";
import { UserSigner } from "@multiversx/sdk-wallet";
import { promises } from 'fs';
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";

import { contractAddress } from 'config';
import { Account,Address, IAddress, INonce } from "@multiversx/sdk-core";

import { BalanceHelper } from 'helpers/balanceHelper';
import { GetServerSideProps } from 'next';
import { UserVerifier } from "@multiversx/sdk-wallet";
import { sign } from 'crypto';

type Props = {
  pemText:string;
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   // const tempText = await promises.readFile("walletKey/walletKey.pem",{ encoding: "utf8" });

//   // return {
//   //   props: {
//   //     pemText: tempText
//   //   }
//   }
// }

// const FormatAmount = dynamic(
//   async () => {
//     return (await import('@multiversx/sdk-dapp/UI/FormatAmount')).FormatAmount;
//   },
//   { ssr: false }
// );

export default function Dashboard({pemText} : Props) {
  const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");
  const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  const [currencyAmount, setCurrencyAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [accBalance, setAccBalance] = useState(0);
  const { address, account} = useGetAccountInfo();
  const  [, setTransactionSessionId] = useState<
string | null>
(null);

  let bHelper : BalanceHelper = new BalanceHelper(account.address);
 
  bHelper.callMetaverseAPI(account.address).then(function(response) {
    setAccBalance(response);
  });
  

  let ownerAddress: Address = new Address('erd1jcqqtrt6zl0ve3cg2a5utyv83vmjp2yjxqt3gnjvccz50ugmpsxs4y5wl9');
  let receiverAddress: Address = new Address('erd1r45kpejjgekq36ue8klvsrx324xs7x3pyk26qf6uhj346x766juqc8vuhx');
 
  let owner: Account = new Account(ownerAddress);
  const ownerVerifier = UserVerifier.fromAddress(ownerAddress);

  const tokenTransfer = async () => {
    const factory = new TransferTransactionsFactory(new GasEstimator());
    const transfer1 = TokenTransfer.fungibleFromAmount('PSF-36ce19', tokenAmount , 18);
  
    const tx1 = factory.createESDTTransfer({
      tokenTransfer: transfer1,
      nonce: 7,
      sender: ownerAddress,
      receiver: receiverAddress,
      chainID: "D",
     
  });
  
 
    // console.log(pemText);
    // let signer = UserSigner.fromPem(pemText);
    // console.log(signer);
    // const serializedTransaction = tx1.serializeForSigning();
    // const transactionSignature = await signer.sign(serializedTransaction);

    // tx1.setNonce(owner.getNonceThenIncrement());
    // tx1.applySignature(transactionSignature);
    
    // console.log(ownerVerifier.verify(serializedTransaction,tx1.getSignature()))

    // console.log("Transaction signature", tx1.getSignature().toString('hex'));
    // console.log("Transaction hash", tx1.getHash().toString());

    // let tx1Hash = await proxyNetworkProvider.sendTransaction(tx1);
    // console.log(tx1Hash)
    
    //await refreshAccount();
    
    const { sessionId } = await sendTransactions({
      transactions: tx1,
      transactionsDisplayInfo : {
        proccessingMessage: 'Proccessing trans ...',
        errorMessage: 'Da go duhash',
        successMessage: 'Qydeeee'
      },
      redirectAfterSign: false,
      skipGuardian: true,
    });

    await refreshAccount();

    

    if(sessionId != null){
    
      setTransactionSessionId(sessionId);
    }
  }
 
  const updateCurrencyAmount = (event:any) => {
    setCurrencyAmount(event.target.value);
    setTokenAmount(event.target.value/2);
  }

  const updateTokenAmount = (event:any) => {
    setTokenAmount(event.target.value);
    setCurrencyAmount(event.target.value*2);
  }


  const sendTransaction = async () => {
    const tokenTransaction = {
      value: `${tokenAmount}`,
      data: 'send',
      receiver: address,
      sender: contractAddress,
    };
    
    
    await refreshAccount();

    const { sessionId } = await sendTransactions({
      transactions: tokenTransaction,
      transactionsDisplayInfo : {
        proccessingMessage: 'Proccessing trans ...',
        errorMessage: 'Da go duhash',
        successMessage: 'Ping transaction successful'
      },
      redirectAfterSign: false
    });

    if(sessionId != null){
      setTransactionSessionId(sessionId);
    }

};

    return <>
      <div className='container py-4'>
      <div className='row'>
        <div className='col-12 col-md-10 mx-auto'>
          <div className='card shadow-sm border-0'>
            <div className='card-body p-1'>
              <div className='card border-0'>
                <div className={utilStyles.inputWrapper}>
                  <div className={utilStyles.whiteText}>
                    <span>Your balance: 
                      <br></br>
                        
                      </span>
                  </div>
                  <div className={utilStyles.currencyFields}>
                    <label className={utilStyles.currencyLabel} htmlFor={utilStyles.currencyInput}>Coins</label>
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
                  <button className={utilStyles.buyBtn} onClick={tokenTransfer}>Buy</button>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div> 

      <div className={utilStyles.transactionTable}>
                <Utils ></Utils>
      </div>   
    </>
}