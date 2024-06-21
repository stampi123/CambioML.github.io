import { useEffect, useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { MapTab, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import ComingSoonBanner from '../ComingSoonBanner';
import { useProductionContext } from '../ProductionContext';
import MapTableSelectContainer from './MapTableSelectContainer';
import MapSchemaContainer from './MapSchemaContainer';

const selectedTabStyle = 'text-neutral-800 border-b-4 border-neutral-800 font-semibold';
const unselectedTabStyle = 'text-neutral-500 border-neutral-200';
const tabStyle = 'p-2 text-center cursor-pointer border-solid border-b-2 hover:border-b-4 hover:font-semibold';

const MapContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const { isProduction } = useProductionContext();

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
          className={`${selectedFile?.mapTab === MapTab.TABLE_SELECT ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => updateFileAtIndex(selectedFileIndex, 'mapTab', MapTab.TABLE_SELECT)}
        >
          1. Select Tables
        </div>
        <div
          className={`${selectedFile?.mapTab === MapTab.MAP_SCHEMA ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => updateFileAtIndex(selectedFileIndex, 'mapTab', MapTab.MAP_SCHEMA)}
        >
          2. Map Schema
        </div>
      </div>
      {isProduction ? (
        <ComingSoonBanner />
      ) : (
        <div>
          {selectedFile?.mapTab === MapTab.TABLE_SELECT && <MapTableSelectContainer />}
          {selectedFile?.mapTab === MapTab.MAP_SCHEMA && <MapSchemaContainer />}
        </div>
      )}
    </div>
  );
};

export default MapContainer;
