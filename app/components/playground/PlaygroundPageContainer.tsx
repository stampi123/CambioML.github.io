'use client';
import PageHero from '../hero/PageHero';
import PlaygroundContainer from './PlaygroundContainer';
import { Auth0Provider } from '@auth0/auth0-react';
import { ProductionProvider } from './ProductionContext';
import UploadModal from '../modals/UploadModal';

interface PlaygroundPageContainerProps {
  production: boolean;
}

const PlaygroundPageContainer = ({ production }: PlaygroundPageContainerProps) => {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || '',
        audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        scope: 'read:current_user update:current_user_metadata',
      }}
    >
      <ProductionProvider initialValue={production}>
        <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
          <UploadModal />
          <PageHero
            title={`${production ? '🛝 Playground' : '🚧 PreProd Playground'}`}
            description={`Test Uniflow with your PDF*, TXT, HTML, and Image files**`}
            short
          />
          <PlaygroundContainer />
        </div>
      </ProductionProvider>
    </Auth0Provider>
  );
};

export default PlaygroundPageContainer;
