import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers';
import { routes, routeNames } from '../../routes';
import { useRouter } from 'next/router';
import utilStyles from '@/styles/utils.module.scss';
import Navbar from './navbar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { query } = useRouter();

    return (
        <>
            <Navbar></Navbar>
            <div className={utilStyles.centeredMain}>
                <AuthenticatedRoutesWrapper
                    routes={routes}
                    unlockRoute={`${routeNames.unlock}${query}`}
                    >
                    <div className={utilStyles.centeredContent}>
                        {children}
                    </div>
             
                </AuthenticatedRoutesWrapper>
            </div>
        </>
    )
}