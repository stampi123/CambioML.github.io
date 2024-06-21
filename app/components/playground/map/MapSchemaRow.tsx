import { PencilSimple, X } from '@phosphor-icons/react';
import MapSchemaCell from './MapSchemaCell';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useEffect, useState } from 'react';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import useKeySelectModal from '@/app/hooks/useKeySelectModal';

interface MapSchemaRowProps {
  thisKey: string;
  mappedKey: string;
  mappedValue: string;
  isLoading: boolean;
}

const MapSchemaRow = ({ thisKey, mappedKey, mappedValue, isLoading }: MapSchemaRowProps) => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const keySelectModal = useKeySelectModal();

  const handleDeleteClick = () => {
    if (selectedFile) {
      const currentKeys = selectedFile.keyMap;
      delete currentKeys[thisKey];
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentKeys);
    }
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);

  const handleEditClick = () => {
    if (selectedFile) {
      keySelectModal.setInputKey(thisKey);
      keySelectModal.setKeyValue(selectedFile?.extractedKV);
      keySelectModal.onOpen();
    }
  };
  return (
    <>
      <MapSchemaCell text={thisKey} handleIconClick={handleDeleteClick} icon={X} isLoading={isLoading} bold />
      <MapSchemaCell text={mappedKey} handleIconClick={handleEditClick} icon={PencilSimple} isLoading={isLoading} />
      <MapSchemaCell text={mappedValue} handleIconClick={handleEditClick} icon={PencilSimple} isLoading={isLoading} />
    </>
  );
};

export default MapSchemaRow;
