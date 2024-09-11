'use client';

import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';

const Auth0Wrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const onRedirectCallback = (appState?: AppState) => {
    router.push(appState?.returnTo || '/'); // Use the router from next/navigation
  };

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        scope: 'read:current_user update:current_user_metadata',
        redirect_uri: 'http://localhost:3000/account',
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0Wrapper;
