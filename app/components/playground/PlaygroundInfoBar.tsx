import { Info, Question } from '@phosphor-icons/react';
import SimpleButton from '../SimpleButton';
import usePlaygroundFeedbackModal from '@/app/hooks/usePlaygroundFeedbackModal';

const PlaygroundInfoBar = () => {
  const playgroundFeedbackModal = usePlaygroundFeedbackModal();
  return (
    <div className="w-full h-fit p-4 rounded-xl bg-neutral-100 text-neutral-700 grid grid-cols-[1fr_150px] gap-4">
      <div className="italic flex items-center gap-2 whitespace-pre-line">
        <Info size={32} />
        {`Please only upload files without sensitive data. For PDFs, we only process the first page. Refresh will clear all files and processed data.`}
      </div>
      <div>
        <SimpleButton label="Feedback" labelIcon={Question} onClick={playgroundFeedbackModal.onOpen} small />
      </div>
    </div>
  );
};

export default PlaygroundInfoBar;
