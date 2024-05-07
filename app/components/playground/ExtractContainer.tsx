import { useEffect, useState } from 'react';
import TableExtractContainer from './TableExtractContainer';
import MarkdownExtractContainer from './MarkdownExtractContainer';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractTab, PlaygroundFile } from '@/app/types/PlaygroundTypes';

const selectedTabStyle = 'text-neutral-800 border-b-4 border-neutral-800 font-semibold';
const unselectedTabStyle = 'text-neutral-500 border-neutral-200';
const tabStyle = 'p-2 text-center cursor-pointer border-solid border-b-2 hover:border-b-4 hover:font-semibold';

const ExtractContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);

  return (
    <div className="h-full w-full grid-row-1 grid grid-rows-[50px_1fr] gap-4">
      <div className="w-full grid grid-cols-2 pt-2">
        <div
          className={`${selectedFile?.extractTab === ExtractTab.FILE_EXTRACT ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.FILE_EXTRACT)}
        >
          Extract to Plain Text
        </div>
        <div
          className={`${selectedFile?.extractTab === ExtractTab.TABLE_EXTRACT ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.TABLE_EXTRACT)}
        >
          Extract Table
        </div>
      </div>
      <div>
        {selectedFile?.extractTab === ExtractTab.INITIAL_STATE ? (
          <div className="grid grid-cols-[1fr_60px_1fr] h-full w-full overflow-auto">
            <MarkdownExtractContainer />
            <div className="text-xl text-neutral-500 flex items-center justify-center">- OR -</div>
            <TableExtractContainer />
          </div>
        ) : (
          <>
            {selectedFile?.extractTab === ExtractTab.TABLE_EXTRACT && <TableExtractContainer />}
            {selectedFile?.extractTab === ExtractTab.FILE_EXTRACT && <MarkdownExtractContainer />}
          </>
        )}
      </div>
    </div>
  );
};

export default ExtractContainer;
