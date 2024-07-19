'use client';

import Container from '../Container';
import FilesContainer from './FilesContainer';
import ActionContainer from './ActionContainer';
import PlaygroundInfoBar from './PlaygroundInfoBar';
import { useEffect } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useProductionContext } from './ProductionContext';
import updateQuota from '@/app/actions/updateQuota';
import PreviewModal from '../modals/PreviewModal';

const playgroundWrapperStyles = 'border-solid border-[1px] border-neutral-gray p-6';

const PlaygroundContainer = () => {
  const { clientId, token, setRemainingQuota, setTotalQuota, userId } = usePlaygroundStore();
  const { apiURL } = useProductionContext();
  useEffect(() => {
    if (!userId || !apiURL || !token) return;
    updateQuota({ api_url: apiURL, userId, token, setTotalQuota, setRemainingQuota, handleError: () => {} });
  }, [clientId, apiURL, token]);

  return (
    <Container styles="h-fit min-h-[600px] py-10">
      <PreviewModal />
      <div className="w-[80vw] min-w-[600px] max-w-[2000px] flex flex-col gap-10">
        <div
          className="
          w-full
          h-full
          grid
          grid-cols-1
          lg:grid-cols-[300px_1fr]
          rounded-2xl
          shadow-lg
        "
        >
          <div className={`${playgroundWrapperStyles} rounded-t-2xl lg:rounded-r-none lg:rounded-l-2xl bg-neutral-100`}>
            <FilesContainer />
          </div>
          <div
            className={`${playgroundWrapperStyles} rounded-b-2xl lg:rounded-l-none lg:rounded-r-2xl border-t-0 lg:border-l-0 lg:border-t-[1px]`}
          >
            <ActionContainer />
          </div>
        </div>
        <PlaygroundInfoBar />
      </div>
    </Container>
  );
};

export default PlaygroundContainer;
