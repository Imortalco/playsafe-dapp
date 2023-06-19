import Head from 'next/head';
import Link from 'next/link';
import homeStyles from '@/styles/Home.module.scss';
import { routeNames } from '../../routes';
import { dAppName } from 'config';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { logout } from '@multiversx/sdk-dapp/utils';

export default function Home() {
  const isLoggedIn = useGetIsLoggedIn();

    if(isLoggedIn) {
      logout(`${window.location.origin}`)
  }

  return (
    <>
      <Head>
        <title>PlaySafe Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.main}>
         <div className={homeStyles.dAppNameWrapper}>
          Welcome to the <span className={homeStyles.dAppName}> { dAppName } ! </span> 
          </div>
         <button className={homeStyles.loginBtn}>
              <Link href={routeNames.unlock}>Login</Link>
         </button>
      </main>
    </>
  )
};
