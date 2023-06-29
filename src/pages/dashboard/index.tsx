import Utils from 'components/Utils/utitls';
import BalanceInfo  from '../../../components/Layout/balanceinfo'
import utilStyles from '@/styles/utils.module.scss'

import { useState } from 'react';
import { faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  ReactModal  from 'react-modal';


import { sendTransactions, calcTotalFee } from '@multiversx/sdk-dapp/services';
import { refreshAccount, addressIsValid, formatAmount, FormatAmountType } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';


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
  const [invalidAmountMsg, setInvalidAmountMsg] = useState('');
  const [accBalance, setAccBalance] = useState('');
  const [receiverAddress, setReceiverAddress] = useState<Address>(new Address(''));
  const [invalidAddressMsg, setInvalidAddressMsg] = useState('');
  const [gasFee, setGasFee] = useState<string>('');
  const { address, account} = useGetAccountInfo();
  const {network} = useGetNetworkConfig();
  const  [, setTransactionSessionId] = useState<
string | null>
(null);
const [isOpen, setIsOpen] = useState(false);
//const [networkConfig, setNetworkConfig] = useState<NetworkConfig>(new NetworkConfig());
const factory = new TransferTransactionsFactory(new GasEstimator());
let bHelper : BalanceHelper = new BalanceHelper(account.address);

bHelper.callMetaverseAPI(account.address).then(function(response:Number) {
 setAccBalance( response.toString() );
});
 
  let ownerAddress: Address = new Address('erd1jcqqtrt6zl0ve3cg2a5utyv83vmjp2yjxqt3gnjvccz50ugmpsxs4y5wl9');
  //let receiverAddress: Address = new Address('erd1r45kpejjgekq36ue8klvsrx324xs7x3pyk26qf6uhj346x766juqc8vuhx');

  let gasEstimator: GasEstimator = new GasEstimator();
  //let networkConfig: NetworkConfig = new NetworkConfig();

  // apiNetworkProvider.getNetworkConfig().then((response) => {
  //   setNetworkConfig(response);
  // });
  gasEstimator.forEGLDTransfer(12);
  let owner: Account = new Account(ownerAddress);
  const ownerVerifier = UserVerifier.fromAddress(ownerAddress);
  let tokenTicker:string = 'PSF-36ce19';
  let chainID: string;

  const tokenTransfer = async () => {
    
    if(tokenAmount > Number(formatAmount({input: accBalance}))){
        setInvalidAmountMsg("Amount cannot be greater than your balance !");
        return;
    }
    else if(tokenAmount < 0){
      setInvalidAmountMsg("Amount cannot be less than 0 !");
      return;
    }
    else {
      setInvalidAmountMsg("");   
    }
    
    const transfer = TokenTransfer.fungibleFromAmount('PSF-36ce19', tokenAmount , 18);
  
    const tx = factory.createESDTTransfer({
      tokenTransfer: transfer,
      sender: new Address(address),
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
      redirectAfterSign: true,
      skipGuardian: true,
    });

    setIsOpen(false);
    await refreshAccount();

    
    if(sessionId != null){
      setTransactionSessionId(sessionId);
    }
  }
 
  // const updateCurrencyAmount = (event:any) => {
  //   setCurrencyAmount(event.target.value);
  //   setTokenAmount(event.target.value/2);
  // }

  const updateTokenAmount = (event:any) => {
    if(event.target.value != '' && Number(event.target.value) > 0){
      setTokenAmount(event.target.value);

      const transfer = TokenTransfer.fungibleFromAmount('PSF-36ce19', tokenAmount , 18);
    
      const tx = factory.createESDTTransfer({
        tokenTransfer: transfer,
        sender: new Address(address),
        receiver: receiverAddress,
        chainID: 'D'
    });
      setGasFee(`${formatAmount({input: String(calcTotalFee([tx], 1000))})} xEGLD`);
    }
    else{
      setGasFee('');
    }

  }

  const updateReceiverAdress = (event: any) => {
    //setReceiverAddress(new Address(event.target.value));
    if(event.target.value != ''){
      let isValid: boolean = addressIsValid(event.target.value);

      if(isValid === true){
        setReceiverAddress(new Address(event.target.value));
        setInvalidAddressMsg("");
      }
      else if(isValid === false) {
        setInvalidAddressMsg("Invalid address !");
      }
    }
    else{
      setInvalidAddressMsg("");
    }
    
  }

    return <>
    <BalanceInfo></BalanceInfo>
    
      <ReactModal className={utilStyles.transferModal} isOpen={isOpen} onRequestClose={() => setIsOpen(false)} > 
        <div className={utilStyles.transferModal}>
          <span className={utilStyles.sendText}>Send</span>

          <div className={utilStyles.receiverContainer}>
              <label htmlFor='receiver-input'>Receiver</label>
              <input id='receiver-input' onChange={updateReceiverAdress}></input>
              <p className={utilStyles.errorMsg}>{invalidAddressMsg}</p>
          </div>

          <div className={utilStyles.amountContainer}>
              <div className={utilStyles.amountAvailabeContainer} >
                <label htmlFor='amount-input'>Amount</label>
                <span className='available-amount'>
                    Available: <FormatAmount value={accBalance} data-testid='balance' token='PSF' digits={2} /> 
                </span>
                
              </div>
              
              <input id='amount-input' type='number' min='0' onChange={updateTokenAmount}></input>
              <p className={utilStyles.errorMsg}>{invalidAmountMsg}</p>
          </div>

          <div className={utilStyles.feeContainer}>
              <label htmlFor='fee-input'>Fee</label>
              <input id='fee-input' type='text' value={gasFee}></input>
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