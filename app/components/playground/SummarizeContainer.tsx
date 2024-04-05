import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile, TransformState } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import Button from '../Button';
import { Article, DownloadSimple } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import toast from 'react-hot-toast';
import ResultContainer from './ResultContainer';

const SummarizeContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');

  const handleSummarize = () => {
    updateFileAtIndex(selectedFileIndex, 'summarizeState', TransformState.TRANSFORMING);
    toast.success(`Generating summaries for ${filename}`);
    setTimeout(() => {
      toast.success(`Summaries generated for ${filename}`);
      updateFileAtIndex(selectedFileIndex, 'summarizeState', TransformState.DONE_TRANSFORMING);
    }, 2000);
  };

  const handleDownload = () => {
    toast.success(`Downloading summaries for ${filename}`);
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
      if (thisFile.file instanceof File) {
        setFilename(thisFile.file.name);
      } else {
        setFilename(thisFile.file);
      }
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);
  return (
    <>
      {selectedFile?.summarizeState === TransformState.READY && (
        <div className="flex flex-col items-start justify-center w-full h-full gap-4 relative">
          <ResultContainer extractResult={selectedFile.extractResult} />
          <div className={`w-full h-fit gap-4`}>
            <Button label="Generate Summaries" onClick={handleSummarize} small labelIcon={Article} disabled={true} />
          </div>
        </div>
      )}
      {selectedFile?.summarizeState === TransformState.TRANSFORMING && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-xl font-semibold text-neutral-500">Generating Summaries</div>
          <PulsingIcon Icon={Article} size={40} />
        </div>
      )}
      {selectedFile?.summarizeState === TransformState.DONE_TRANSFORMING && (
        <div className="flex flex-col items-start w-full h-full gap-4">
          <div className="overflow-auto relative w-full h-full bg-neutral-100 text-neutral-500 rounded-lg">
            <Markdown className="markdown absolute p-4  whitespace-pre-wrap w-full h-full">
              {selectedFile.extractResult}
            </Markdown>
          </div>
          <div className={`w-full h-fit gap-4`}>
            <Button label="Download csv" onClick={handleDownload} small labelIcon={DownloadSimple} />
          </div>
        </div>
      )}
    </>
  );
};

export default SummarizeContainer;
