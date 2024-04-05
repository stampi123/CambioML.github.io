'use client';
import PageHero from '../components/hero/PageHero';
import PlaygroundContainer from '../components/playground/PlaygroundContainer';
// import { Auth0Provider } from '@auth0/auth0-react';

const PlaygroundPage = () => {
  return (
    // <Auth0Provider
    //   domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
    //   clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
    //   authorizationParams={{
    //     redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || '',
    //     audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
    //     scope: 'read:current_user update:current_user_metadata',
    //   }}
    // >
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero
        title={`🛝 Playground`}
        description={`Test Uniflow with your PDF*, TXT, HTML, and Image files**`}
        short
      />
      <PlaygroundContainer />
    </div>
    // </Auth0Provider>
  );
};

export default PlaygroundPage;
