import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractState, MapTab, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import { ArrowLeft, DownloadSimple, Plus, Robot } from '@phosphor-icons/react';
import Button from '../../Button';
import MapSchemaRow from './MapSchemaRow';
import InputBasic from '../../inputs/InputBasic';
import toast from 'react-hot-toast';
import KeySelectModal from '../../modals/KeySelectModal';
import { runMappingRequest } from '@/app/actions/runMappingRequest';
import { downloadFile } from '@/app/actions/downloadFile';

const MIN_INPUT_LENGTH = 1;

const MapSchemaContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleMapSchema = async () => {
    setIsLoading(true);
    if (selectedFile) {
      const allTables = selectedFile.tableMdExtractResult;
      const tablesToMap = allTables.filter((table, i) => selectedFile.tableMapIndices.has(i));

      const currentMap = selectedFile.keyMap;

      const tableKeys: string[] = [];
      for (const table of tablesToMap) {
        tableKeys.push(...Object.keys(table['tableData']));
      }
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentMap);
      const currentKeys = Object.keys(currentMap).filter((key) => currentMap[key] === '' || currentMap[key] === null);

      if (currentKeys.length > 0) {
        try {
          const result = await runMappingRequest({ tableSchema: tableKeys, keysToMap: currentKeys });
          setIsLoading(false);
          for (const key in result) {
            if (Object.hasOwn(currentMap, key)) {
              currentMap[key] = result[key];
            }
          }
          updateFileAtIndex(selectedFileIndex, 'keyMap', currentMap);
          toast.success(`Generated Schema Map for ${filename}`);
        } catch (error) {
          toast.error(`Error mapping schema for ${filename}. Please try again.`);
        }
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleQueryChange = (newQuery: string) => {
    if (newQuery.length < MIN_INPUT_LENGTH) {
      setInputError(`Input must be at least ${MIN_INPUT_LENGTH} characters`);
    } else {
      setInputError('');
    }
    setQuery(newQuery);
  };

  const handleAddKey = () => {
    if (selectedFile) {
      const currentMap = selectedFile.keyMap;
      let newKeys: string[] = [];

      if (query.includes(',')) {
        newKeys = query
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      } else {
        newKeys = [query];
      }
      newKeys = newKeys.filter((key) => !currentMap[key]);
      for (const key of newKeys) {
        currentMap[key] = '';
      }
      updateFileAtIndex(selectedFileIndex, 'keyMap', currentMap);
      setQuery('');
    }
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

  const handleTableSelectClick = () => {
    updateFileAtIndex(selectedFileIndex, 'mapTab', MapTab.TABLE_SELECT);
  };

  const handleDownloadTableJson = () => {
    if (!selectedFile?.keyMap) {
      return;
    }
    const tableDataJSON = [];

    for (const table of selectedFile.tableMdExtractResult) {
      for (const tableKey in table['tableData']) {
        if (Object.values(selectedFile.keyMap).includes(tableKey)) {
          const thisData: { [key: string]: string | string[] } = {};
          let inputKey = '';
          for (const key in selectedFile.keyMap) {
            if (selectedFile.keyMap[key] === tableKey) {
              inputKey = key;
              break;
            }
          }
          thisData['input_key'] = inputKey;
          thisData['mapped_key'] = tableKey;
          thisData['mapped_value'] = table['tableData'][tableKey];

          tableDataJSON.push(thisData);
        }
      }
    }
    downloadFile({
      filename,
      fileContent: JSON.stringify(tableDataJSON, null, 2),
      fileType: 'application/json',
      suffix: `_extracted_table.json`,
    });
  };

  const hasNonNullValue = (keyMap: { [key: string]: string | null }) => {
    for (const key in keyMap) {
      if (keyMap[key] !== '' && keyMap[key] !== null) return true;
    }
  };

  return (
    <>
      {selectedFile?.tableMdExtractState !== ExtractState.DONE_EXTRACTING ||
      selectedFile?.tableMdExtractResult.length === 0 ||
      selectedFile?.tableMdExtractResult[0]['table'] === '' ||
      selectedFile?.tableMapIndices.size === 0 ? (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4">
          <div className="text-xl font-semibold text-neutral-800">No Tables Extracted/Selected</div>
          <div className="w-[300px] gap-4">
            <Button label="Go to Table Extract" onClick={handleTableSelectClick} small labelIcon={ArrowLeft} />
          </div>
        </div>
      ) : (
        <div className="h-full grid grid-cols-1 grid-rows-[35px_1fr_70px_70px] gap-4">
          <div className="col-span-1 row-span-1 grid grid-cols-[2fr_2fr_3fr] 2xl:grid-cols-[250px_250px_1fr] gap-4">
            <div className="text-md font-semibold">Input Key</div>
            <div className="text-md font-semibold">Mapped Key</div>
            <div className="text-md font-semibold">Mapped Value</div>
          </div>
          <div className="row-span-1 overflow-auto relative box-border">
            <div className="w-full h-fit justify-center absolute grid grid-cols-[2fr_2fr_3fr] 2xl:grid-cols-[250px_250px_1fr] gap-4">
              {Object.keys(selectedFile?.keyMap || {}).length === 0 ? (
                <MapSchemaRow thisKey="" key={0} mappedKey="" mappedValue="" isLoading={isLoading} />
              ) : (
                <>
                  {selectedFile &&
                    Object.keys(selectedFile?.keyMap || {}).map((key, i) => {
                      const fullExtractedKey = selectedFile?.keyMap[key];
                      let tableName = '';
                      let colHeader = '';
                      let extractedValue = '';
                      if (selectedFile?.keyMap[key]) {
                        [tableName, colHeader] = fullExtractedKey.split('-') || ['', ''];
                        const thisTableData = selectedFile?.tableMdExtractResult.filter(
                          (tableData) => tableData['title'] === tableName
                        )[0];
                        if (thisTableData && thisTableData['tableData'][fullExtractedKey]) {
                          extractedValue = JSON.stringify(thisTableData['tableData'][fullExtractedKey]);
                        }
                      } else if (!isLoading && colHeader === '') {
                        colHeader = 'None';
                      }
                      return (
                        <MapSchemaRow
                          thisKey={key}
                          key={i}
                          mappedKey={colHeader || ''}
                          mappedValue={extractedValue}
                          isLoading={isLoading}
                        />
                      );
                    })}
                </>
              )}
            </div>
          </div>
          <div
            className={`row-span-1 h-full border-b-[1px] border-neutral-200 flex items-center justify-center gap-2 h-fit pb-2`}
          >
            <div className={`w-full h-fit gap-4 grid grid-cols-[1fr_150px]`}>
              <InputBasic
                label="Schema Keys"
                value={query}
                onChange={handleQueryChange}
                error={inputError}
                labelDescription="Enter a single key or multiple keys as comma-separated list"
                highlight={Object.keys(selectedFile?.keyMap || {}).length === 0 && !query}
                onEnter={handleAddKey}
              />
              <Button
                label="Add Keys"
                onClick={handleAddKey}
                small
                labelIcon={Plus}
                disabled={(query.length < MIN_INPUT_LENGTH && inputError !== '') || isLoading}
              />
            </div>
          </div>
          <div className="row-span-1 flex gap-4">
            <Button
              label="Map Schema"
              onClick={handleMapSchema}
              small
              labelIcon={Robot}
              disabled={(selectedFile && Object.keys(selectedFile?.keyMap).length === 0) || isLoading}
            />
            <Button
              label="Download Json"
              onClick={handleDownloadTableJson}
              small
              labelIcon={DownloadSimple}
              disabled={!hasNonNullValue(selectedFile.keyMap) || isLoading}
            />
          </div>
          <KeySelectModal />
        </div>
      )}
    </>
  );
};

export default MapSchemaContainer;
