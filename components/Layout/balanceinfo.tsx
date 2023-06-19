import balanceStyles from '@/styles/balance-info.module.scss'
import dynamic from 'next/dynamic';
import { BalanceHelper } from 'helpers/balanceHelper';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

import { useState } from 'react';

const FormatAmount = dynamic(
    async () => {
      return (await import('@multiversx/sdk-dapp/UI/FormatAmount')).FormatAmount;
    },
    { ssr: false }
  );

export default function BalanceInfo() {
    const [accBalance, setAccBalance] = useState(0);
    const { address, account} = useGetAccountInfo();
    let ready:boolean = true;
  let bHelper : BalanceHelper = new BalanceHelper(account.address);
 
  bHelper.callMetaverseAPI(account.address).then(function(response) {
    setAccBalance(response);
  });
  
  return <>
    <div className={balanceStyles.balanceContainer}>
        <span className={balanceStyles.tokenBalanceText}>PlaySafe Tokens: 
        <FormatAmount value={accBalance.toString()} data-testid='balance' token='PSF' className={balanceStyles.tokenBalanceValue} digits={2} /> 
        </span> 
    </div>
  </>
}