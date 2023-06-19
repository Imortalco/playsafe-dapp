import Utils from 'components/Utils/utitls';
import BalanceInfo  from '../../../components/Layout/balanceinfo'
import utilStyles from '@/styles/utils.module.scss'

import { useState } from 'react';
import { faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  ReactModal  from 'react-modal';


import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';


import { Interaction, TokenTransfer } from "@multiversx/sdk-core";
import { GasEstimator, TransferTransactionsFactory } from "@multiversx/sdk-core";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { ApiNetworkProvider, NetworkConfig } from "@multiversx/sdk-network-providers";

import { Account,Address, IAddress, INonce } from "@multiversx/sdk-core";

import { UserVerifier } from "@multiversx/sdk-wallet";
import { BalanceHelper } from 'helpers/balanceHelper';
import dynamic from 'next/dynamic';


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

const FormatAmount = dynamic(
  async () => {
    return (await import('@multiversx/sdk-dapp/UI/FormatAmount')).FormatAmount;
  },
  { ssr: false }
);

export default function Dashboard({pemText} : Props) {
  const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");
  const apiNetworkProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com");
  const [currencyAmount, setCurrencyAmount] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [accBalance, setAccBalance] = useState('');
  
  const { address, account} = useGetAccountInfo();
  const  [, setTransactionSessionId] = useState<
string | null>
(null);
const [isOpen, setIsOpen] = useState(false);
const [networkConfig, setNetworkConfig] = useState<NetworkConfig>(new NetworkConfig());

let bHelper : BalanceHelper = new BalanceHelper(account.address);

bHelper.callMetaverseAPI(account.address).then(function(response:Number) {
 setAccBalance( response.toString() );
});
  
 

  let ownerAddress: Address = new Address('erd1jcqqtrt6zl0ve3cg2a5utyv83vmjp2yjxqt3gnjvccz50ugmpsxs4y5wl9');
  let receiverAddress: Address = new Address('erd1r45kpejjgekq36ue8klvsrx324xs7x3pyk26qf6uhj346x766juqc8vuhx');

  let gasEstimator: GasEstimator = new GasEstimator();
  //let networkConfig: NetworkConfig = new NetworkConfig();

  // apiNetworkProvider.getNetworkConfig().then((response) => {
  //   setNetworkConfig(response);
  // });

  let owner: Account = new Account(ownerAddress);
  const ownerVerifier = UserVerifier.fromAddress(ownerAddress);
  let tokenTicker:string = 'PSF-36ce19';
  let chainID: string;
  const tokenTransfer = async () => {
    
    const factory = new TransferTransactionsFactory(new GasEstimator());
    console.log(tokenAmount);
    const transfer = TokenTransfer.fungibleFromAmount('PSF-36ce19', tokenAmount , 18);
  
    const tx = factory.createESDTTransfer({
      tokenTransfer: transfer,
      sender: ownerAddress,
      receiver: receiverAddress,
      chainID: 'D'
  });
    
    const { sessionId } = await sendTransactions({
      transactions: tx,
      transactionsDisplayInfo : {
        proccessingMessage: 'Proccessing transaction ...',
        errorMessage: 'Transaction has failed',
        successMessage: 'Transaction succesfull !'
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
    console.log('opaa');
    setTokenAmount(event.target.value);
  }

    return <>
    <BalanceInfo></BalanceInfo>
    
      <ReactModal className={utilStyles.transferModal} isOpen={isOpen} onRequestClose={() => setIsOpen(false)} > 
        <div className={utilStyles.transferModal}>
          <span className={utilStyles.sendText}>Send</span>

          <div className={utilStyles.receiverContainer}>
              <label htmlFor='receiver-input'>Receiver</label>
              <input id='receiver-input'></input>
          </div>

          <div className={utilStyles.amountContainer}>
              <div className={utilStyles.amountAvailabeContainer} >
                <label htmlFor='amount-input'>Amount</label>
                <span className='available-amount'>
                    Available: <FormatAmount value={accBalance} data-testid='balance' token='PSF' digits={2} /> 
                </span>
                
              </div>
              
              <input id='amount-input' type='number' onChange={updateTokenAmount} ></input>
          </div>

          <div className={utilStyles.feeContainer}>
              <label htmlFor='fee-input'>Fee</label>
              <input id='fee-input' value='0.00'></input>
          </div>

          <button className={utilStyles.sendBtn} onClick={tokenTransfer}>Send PSF</button>
          <button className={utilStyles.cancelBtn} onClick={() => setIsOpen(false)}>Cancel</button>

        </div>
      
      </ReactModal>
  
   
    {/* <div className='container py-4'>
      <div className='row'>
        <div className='col-12 col-md-10 mx-auto'>
          <div className={`${utilStyles.cardSmall} card shadow-sm `}>  
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
                <button className={utilStyles.claimBtn} onClick={tokenTransfer}>Claim</button>
              </div>
            </div>
          </div>
      </div>
    </div>  */}

    <button className={utilStyles.transferBtn} onClick={() => setIsOpen(true)}> Transfer </button>

      <div className={utilStyles.transactionTable}>
                <Utils ></Utils>
      </div>   
    </>
}