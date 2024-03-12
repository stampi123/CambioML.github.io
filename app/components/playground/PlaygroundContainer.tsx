'use client';

import Container from '../Container';
import FilesContainer from './FilesContainer';
import ActionContainer from './ActionContainer';
import PlaygroundInfoBar from './PlaygroundInfoBar';

const playgroundWrapperStyles = 'border-solid border-[1px] border-neutral-gray p-6';

const PlaygroundContainer = () => {
  return (
    <Container styles="h-fit min-h-[600px] py-10">
      <div className="w-[80vw] min-w-[600px] max-w-[2000px] flex flex-col gap-10">
        <div
          className="
        w-full
        h-full
        grid
        grid-cols-1
        lg:grid-cols-[300px_1fr]
        rounded-2xl
        shadow-md
        "
        >
          <div className={`${playgroundWrapperStyles} rounded-t-2xl lg:rounded-r-none lg:rounded-l-2xl bg-neutral-100`}>
            <FilesContainer />
          </div>
          <div className={`${playgroundWrapperStyles} rounded-b-2xl lg:rounded-l-none lg:rounded-r-2xl border-l-0`}>
            <ActionContainer />
          </div>
        </div>
        <PlaygroundInfoBar />
      </div>
    </Container>
  );
};

export default PlaygroundContainer;
