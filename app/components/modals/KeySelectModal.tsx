'use client';

import useKeySelectModal from '@/app/hooks/useKeySelectModal';
import SmallModal from './SmallModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractedMDTable, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';

function mergeTableData(tables: ExtractedMDTable[]): { [key: string]: string[] } {
  const mergedData: { [key: string]: string[] } = {};

  tables.forEach((table) => {
    Object.keys(table.tableData).forEach((key) => {
      if (!mergedData[key]) {
        mergedData[key] = [];
      }
      mergedData[key] = mergedData[key].concat(table.tableData[key]);
    });
  });

  return mergedData;
}

const KeySelectModal = () => {
  const KeySelectModal = useKeySelectModal();
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();

  const handleKVClick = (key: string) => {
    if (selectedFileIndex !== null && selectedFile) {
      const curKeyMap = files[selectedFileIndex].keyMap;
      curKeyMap[KeySelectModal.inputKey] = key;
      updateFileAtIndex(selectedFileIndex, 'keyMap', curKeyMap);
      const tableKeysData = mergeTableData(selectedFile.tableMdExtractResult);
      const newCol = tableKeysData[key];
      const tableMappedData: string[][] = selectedFile.tableMappedData;
      const replaceIndex = tableMappedData[0].indexOf(KeySelectModal.inputKey);
      const newTableMappedData: string[][] = [];
      tableMappedData.forEach((tableRow, i) => {
        if (i === 0) {
          newTableMappedData.push(tableRow);
        } else {
          if (newCol.length === 1) {
            tableRow[replaceIndex] = newCol[0];
          } else {
            tableRow[replaceIndex] = newCol[i] || '';
          }
          newTableMappedData.push(tableRow);
        }
      });
      updateFileAtIndex(selectedFileIndex, 'tableMappedData', newTableMappedData);
      KeySelectModal.onClose();
    }
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);
  const bodyContent = (
    <div className="flex items-start justify-center w-full h-full md:h-[500px] overflow-y-auto p-0">
      <div className="h-fit w-full text-neutral-700 p-1 flex flex-col gap-2">
        {KeySelectModal.tableData &&
          KeySelectModal.tableData.map((table) => {
            const tableTitle = table['title'];

            return Object.keys(table['tableData']).map((key) => {
              const thisKey = key.split('-')[1] || key;
              return (
                <div
                  key={key}
                  className="cursor-pointer border-[1px] border-solid border-neutral-200 hover:bg-neutral-100 w-full p-4 rounded-lg grid grid-cols-3 gap-2 h-[50px]"
                  onClick={() => handleKVClick(key)}
                >
                  <div className="flex gap-2">
                    <div className="font-semibold">Key:</div>
                    <div>{thisKey}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="font-semibold">Table:</div>
                    <div className="text-center">{tableTitle}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="font-semibold">Value:</div>
                    <div className="overflow-x-auto whitespace-nowrap">{JSON.stringify(table['tableData'][key])}</div>
                  </div>
                </div>
              );
            });
          })}
      </div>
    </div>
  );

  return (
    <SmallModal
      title={`Key Edit: ${KeySelectModal.inputKey}`}
      isOpen={KeySelectModal.isOpen}
      onClose={KeySelectModal.onClose}
      body={bodyContent}
    />
  );
};

export default KeySelectModal;
