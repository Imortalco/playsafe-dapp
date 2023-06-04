import React, { PropsWithChildren } from 'react';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { useRouter } from 'next/router';
import { routeNames } from '../routes';


export const AuthRedirectWrapper = ({ children }: PropsWithChildren) => {
    const isLoggedin = useGetIsLoggedIn();
    const router = useRouter();
    
    if(isLoggedin) {
        router.push(routeNames.dashboard);
        return null;
    }

    return <>{children}</>
}