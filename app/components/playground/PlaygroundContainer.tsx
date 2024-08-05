'use client';

import FilesContainer from './FilesContainer';
import ActionContainer from './ActionContainer';
import PlaygroundInfoBar from './PlaygroundInfoBar';
import PreviewModal from '../modals/PreviewModal';
import CompareModal from '../modals/CompareModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';

const PlaygroundContainer = () => {
  const { fileCollapsed } = usePlaygroundStore();
  const playgroundWrapperStyles = `border-solid border-[1px] border-neutral-gray ${fileCollapsed ? 'p-2' : 'p-6'}`;
  return (
    // <Container styles="h-fit min-h-[600px] py-10">
    <>
      <PreviewModal />
      <CompareModal />
      <div className="w-full min-w-[600px] max-w-[2520px] grid grid-rows-[1fr_50px] gap-0 h-[92vh] lg:h-[70vh]">
        <div
          className={`
          w-full
          h-[70vh]
          grid
          grid-cols-1
          ${fileCollapsed ? 'lg:grid-cols-[100px_1fr]' : 'lg:grid-cols-[325px_1fr]'}
          `}
        >
          <div className={`${playgroundWrapperStyles} bg-neutral-100 pr-0`}>
            <FilesContainer />
          </div>
          <div className={`${playgroundWrapperStyles} border-l-[1px] border-b-[1px]`}>
            <ActionContainer />
          </div>
        </div>
        <div className="h-4">
          <PlaygroundInfoBar />
        </div>
      </div>
    </>
    // </Container>
  );
};

export default PlaygroundContainer;
