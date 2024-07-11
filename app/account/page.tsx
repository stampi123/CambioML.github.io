'use client';

import AccountPageContainer from './AccountPageContainer';
import { Auth0Provider } from '@auth0/auth0-react';

const AccountPage = () => {
  const redirectUri = 'http://localhost:3000/account';
  return (
    <div>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
        authorizationParams={{
          redirect_uri: redirectUri || '',
          audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
          scope: 'read:current_user update:current_user_metadata',
        }}
      >
        <AccountPageContainer />
      </Auth0Provider>
    </div>
  );
};

export default AccountPage;
