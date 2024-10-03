import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import LoginComponent from '../auth/Login';
import PlaygroundTab from './PlaygroundTab';
import ExtractContainer from './ExtractContainer';
import { useEffect, useState } from 'react';
import { PlaygroundFile, PlaygroundTabs } from '@/app/types/PlaygroundTypes';
import UploadButton from './UploadButton';
import MapContainer from './table/MapContainer';
import ProToggleButton from './ProToggleButton';

const ActionContainer = () => {
  const { loggedIn, selectedFileIndex, files } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);

  return (
    <div className="w-full h-full min-h-[600px] grid grid-rows-[50px_1fr]">
      <div className={`w-full grid grid-cols-[1fr_1fr_150px]`}>
        {Object.values(PlaygroundTabs).map((tab) => (
          <PlaygroundTab key={tab} label={tab} />
        ))}
        <ProToggleButton />
      </div>
      {loggedIn ? (
        selectedFileIndex === null ? (
          <div className="flex flex-col items-center justify-center h-full overflow-auto gap-4">
            <div className="text-xl font-semibold text-neutral-500">Please upload a file.</div>
            <div className="w-[300px]">
              <UploadButton small />
            </div>
          </div>
        ) : (
          <div className="h-full border border-solid border-2 border-t-0 border-neutral-200 rounded-b-xl p-4 pt-0">
            {(selectedFile?.activeTab === PlaygroundTabs.PLAIN_TEXT || selectedFileIndex === null) && (
              <ExtractContainer />
            )}
            {selectedFile?.activeTab === PlaygroundTabs.TABLE && <MapContainer />}
          </div>
        )
      ) : (
        <LoginComponent />
      )}
    </div>
  );
};

export default ActionContainer;
