import { useEffect, useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { TableTab, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import MapTableSelectContainer from './MapTableSelectContainer';
import MapSchemaContainer from './MapSchemaContainer';
import TableExtractContainer from './TableExtractContainer';

const selectedTabStyle = 'text-neutral-800 border-b-4 border-neutral-800 font-semibold';
const unselectedTabStyle = 'text-neutral-500 border-neutral-200';
const tabStyle = 'p-2 text-center cursor-pointer border-solid border-b-2 hover:border-b-4 hover:font-semibold';

const MapContainer = () => {
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
      <div className="w-full grid grid-cols-3 pt-2">
        <div
          className={`${selectedFile?.tableTab === TableTab.TABLE_EXTRACT ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => updateFileAtIndex(selectedFileIndex, 'tableTab', TableTab.TABLE_EXTRACT)}
        >
          1. Extract Tables
        </div>
        <div
          className={`${selectedFile?.tableTab === TableTab.TABLE_SELECT ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => updateFileAtIndex(selectedFileIndex, 'tableTab', TableTab.TABLE_SELECT)}
        >
          2. Select Tables to Map
        </div>
        <div
          className={`${selectedFile?.tableTab === TableTab.MAP_SCHEMA ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => updateFileAtIndex(selectedFileIndex, 'tableTab', TableTab.MAP_SCHEMA)}
        >
          3. Map Schema
        </div>
      </div>
      <div>
        {selectedFile?.tableTab === TableTab.TABLE_EXTRACT && <TableExtractContainer />}
        {selectedFile?.tableTab === TableTab.TABLE_SELECT && <MapTableSelectContainer />}
        {selectedFile?.tableTab === TableTab.MAP_SCHEMA && <MapSchemaContainer />}
      </div>
    </div>
  );
};

export default MapContainer;
