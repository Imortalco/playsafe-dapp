import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks';
import { logout } from '@multiversx/sdk-dapp/utils';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { routeNames } from '../../routes';
import { dAppName } from '../../config';
import navStyles from '@/styles/navbar.module.scss'
import { getAccountBalance } from '@multiversx/sdk-dapp/utils/account';

export default function Navbar(){
    const isLoggedIn = useGetIsLoggedIn();

    const handleLogout = () => {
        logout(`${window.location.origin}/unlock`);
    };

    const { address, account} = useGetAccountInfo();
    
    return (
        <BsNavbar className='bg-white border-bottom px-4 py-3'>
            <div className='container-fluid'>
                <div className='d-flex align-items-center navbar-brand mr-0'>
                    <span className='text-muted'>
                        {dAppName}
                    </span>
                </div>

                <Nav className='ml-auto'>
                    {isLoggedIn && (
                        <>
                            <NavItem className={ navStyles.navItemCenteredContent }> 
                                <span className='text-muted'>Hello, {account.username}</span>
                            </NavItem>
                            <NavItem>
                                <button className='btn btn-outline-danger btn-small' onClick={handleLogout}>Logout</button>
                            </NavItem>
                        </>
                    )}
                </Nav>

            </div>
        </BsNavbar>
    )
}