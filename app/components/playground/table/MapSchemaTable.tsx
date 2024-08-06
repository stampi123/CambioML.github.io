import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import MapSchemaCell from './MapSchemaCell';
import { PencilSimple, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import useKeySelectModal from '@/app/hooks/useKeySelectModal';

interface MapSchemaTableProps {
  keyMap: { [key: string]: string };
  tableMappedDataRows: string[][];
  isLoading: boolean;
}

const MapSchemaTable = ({ keyMap, tableMappedDataRows, isLoading }: MapSchemaTableProps) => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const keySelectModal = useKeySelectModal();

  const handleDeleteClick = (thisKey: string) => {
    if (selectedFile) {
      const currentKeys = keyMap;
      delete currentKeys[thisKey];
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentKeys);
      const currentTableData = selectedFile.tableMappedDataRows;
      if (selectedFile.tableMappedDataRows === undefined) return;
      const keyIndex = currentTableData[0].indexOf(thisKey);
      const newMappedData = currentTableData.map((innerArray) => innerArray.filter((_, index) => index !== keyIndex));
      updateFileAtIndex(selectedFileIndex, 'tableMappedDataRows', newMappedData);
    }
  };
  const handleMappedDeleteClick = (thisKey: string) => {
    if (selectedFile) {
      const currentKeys = keyMap;
      currentKeys[thisKey] = '';
      const currentTableData = selectedFile.tableMappedDataRows;
      const keyIndex = currentTableData[0].indexOf(thisKey);
      const newMappedData = currentTableData.map((innerArray, rowIndex) =>
        innerArray.map((val, index) => {
          if (index !== keyIndex || rowIndex === 0) return val;
          return '';
        })
      );
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentKeys);
      updateFileAtIndex(selectedFileIndex, 'tableMappedDataRows', newMappedData);
    }
  };
  const handleEditClick = (thisKey: string) => {
    if (selectedFile) {
      const allTables = selectedFile.tableMdExtractResult;
      const selectedTables = allTables.filter((table, i) => selectedFile.tableMapIndices.has(i));
      keySelectModal.setInputKey(thisKey);
      keySelectModal.setTableData(selectedTables);
      keySelectModal.onOpen();
    }
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);
  const inputKeys = Object.keys(keyMap);
  const mappedKeys = Object.values(keyMap);
  return (
    <div className="w-full h-full">
      <table className="mapped-table">
        <thead>
          <tr>
            <th className="w-auto">Input Key</th>
            {inputKeys.map((inputKey, i) => (
              <th key={`${inputKey}_${i}`} className="w-auto">
                {' '}
                <MapSchemaCell
                  text={inputKey}
                  handleIconClick={() => handleDeleteClick(inputKey)}
                  icon={X}
                  isLoading={isLoading}
                  bold
                />
              </th>
            ))}
          </tr>
          <tr>
            <th className="w-auto">Mapped Key</th>
            {mappedKeys.map((mappedKey, i) => (
              <th key={`${mappedKey}_${i}`} className="w-auto">
                <MapSchemaCell
                  text={mappedKey || ''}
                  handleIconClick={() => handleEditClick(inputKeys[i])}
                  icon={PencilSimple}
                  secondIcon={X}
                  handleSecondIconClick={() => handleMappedDeleteClick(inputKeys[i])}
                  isLoading={isLoading}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableMappedDataRows &&
            tableMappedDataRows.length > 0 &&
            tableMappedDataRows.slice(1).map((tableRow, rowIndex) => (
              <tr key={rowIndex}>
                {rowIndex === 0 ? <th className="w-auto">Mapped Values</th> : <th className="w-auto"></th>}
                {tableRow.map((tableData, cellIndex) => (
                  <td key={cellIndex} className="w-auto">
                    <MapSchemaCell text={tableData || ''} isLoading={isLoading} />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MapSchemaTable;
