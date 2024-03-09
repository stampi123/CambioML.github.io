import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import LoginComponent from '../auth/Login';
import PlaygroundTab from './PlaygroundTab';
import ExtractContainer from './ExtractContainer';
import TransformContainer from './TransformContainer';
import { useEffect, useState } from 'react';
import { PlaygroundFile, PlaygroundTabs } from '@/app/types/PlaygroundTypes';

const ActionContainer = () => {
  const { loggedIn, selectedFileIndex, files } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);

  return (
    <div className="w-full h-full min-h-[600px] md:h-[50vh] grid grid-rows-[50px_1fr]">
      <div className="w-full grid grid-cols-2">
        {Object.values(PlaygroundTabs).map((tab) => (
          <PlaygroundTab key={tab} label={tab} />
        ))}
      </div>
      {loggedIn ? (
        selectedFile?.activeTab === '1. Extract' || selectedFileIndex === null ? (
          <ExtractContainer />
        ) : (
          <TransformContainer />
        )
      ) : (
        <LoginComponent />
      )}
    </div>
  );
};

export default ActionContainer;
