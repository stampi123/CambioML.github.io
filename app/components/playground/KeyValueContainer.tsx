import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile, TransformState } from '@/app/types/PlaygroundTypes';
import { useCallback, useEffect, useState } from 'react';
import Button from '../Button';
import { BracketsCurly, DownloadSimple, Plus } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import toast from 'react-hot-toast';
import InputBasic from '../inputs/InputBasic';
import { downloadFile } from '@/app/actions/downloadFile';
import { AxiosError, AxiosResponse } from 'axios';
import ResultContainer from './ResultContainer';
import KeyValueTable from './KeyValueTable';
import { useProductionContext } from './ProductionContext';
import { runRequestJob } from '@/app/actions/runRequestJob';
import { runRequestJob as runPreProdRequestJob } from '@/app/actions/preprod/runRequestJob';

const MIN_INPUT_LENGTH = 2;
const KeyValueContainer = () => {
  const { apiURL, isProduction } = useProductionContext();
  const { selectedFileIndex, files, filesFormData, updateFileAtIndex, token, clientId } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [keys, setKeys] = useState<string[]>([]);

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

  const handleQueryChange = (newQuery: string) => {
    if (newQuery.length < MIN_INPUT_LENGTH) {
      setInputError(`Input must be at least ${MIN_INPUT_LENGTH} characters`);
    } else {
      setInputError('');
    }
    setQuery(newQuery);
  };

  const addKey = () => {
    setKeys([query, ...keys]);
    setQuery('');
  };

  const handleSuccess = (response: AxiosResponse) => {
    const result = response.data;
    console.log('got result', result);
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
      return;
    }
    updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.DONE_TRANSFORMING);
    updateFileAtIndex(selectedFileIndex, 'keyValueResult', JSON.stringify(result[0][0]));
    toast.success(`Generated Key-Values from ${filename}!`);
  };

  const handleError = (e: AxiosError) => {
    if (e.response) {
      if (e.response.status === 400) {
        toast.error(`${filename}: Parameter is invalid. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
        return;
      } else if (e.response.status === 404) {
        toast.error(`${filename}: Job not found. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
        return;
      } else if (e.response.status === 500) {
        toast.error(`${filename}: Job has failed. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
        return;
      }
    }
    toast.error(`Error transforming ${filename}. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
    toast.error(`Transform request for ${filename} timed out. Please try again.`);
  };

  const handleDownload = useCallback(() => {
    if (selectedFile?.keyValueResult) {
      downloadFile({
        filename,
        fileContent: selectedFile.keyValueResult,
        fileType: 'application/json',
        suffix: '_key-value.json',
      });
    }
  }, [selectedFile, filename]);

  const handleKeyValueTransform = async () => {
    updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.TRANSFORMING);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
      toast.error(`Error extracting ${filename}. Missing formData. Please try again.`);
      return;
    }
    const user_prompt = `Return an object in JSON format with all of the following keys and their corresponding values:
${JSON.stringify(keys)}

If a key and/or value is not found in the text, please still include the key with a value of 'NA'.
`;

    if (selectedFileIndex === null) {
      toast.error(`Error extracting ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
      return;
    }
    if (isProduction) {
      runRequestJob({
        apiURL,
        clientId,
        token,
        sourceType: 's3',
        fileId: fileData.fileId,
        jobType: 'info_extraction',
        jobParams: {
          user_prompt,
          use_textract: true,
        },
        selectedFileIndex,
        filename,
        handleError,
        handleSuccess,
        handleTimeout,
        updateFileAtIndex,
      });
    } else {
      runPreProdRequestJob({
        apiURL,
        clientId,
        token,
        sourceType: 's3',
        fileId: fileData.fileId,
        jobType: 'info_extraction',
        jobParams: {
          user_prompt,
          use_textract: true,
        },
        selectedFileIndex,
        filename,
        handleError,
        handleSuccess,
        handleTimeout,
        updateFileAtIndex,
      });
    }
  };

  return (
    <>
      {selectedFile?.keyValueState === TransformState.READY && (
        <div className="flex flex-col items-start w-full h-full gap-4">
          <ResultContainer extractResult={selectedFile.extractResult} />
          <div className={`w-full h-fit gap-4 grid grid-cols-[1fr_150px]`}>
            <InputBasic label="New Key" value={query} onChange={handleQueryChange} error={inputError} />
            <Button
              label="Add Key"
              onClick={addKey}
              small
              labelIcon={Plus}
              disabled={query.length < MIN_INPUT_LENGTH && inputError === ''}
            />
          </div>
          <div className="p-4 bg-neutral-100 rounded-xl w-full">
            <div className="text-lg font-semibold">KEYS TO EXTRACT</div>
            <div className="overflow-auto">
              <div className="w-full h-[50px] flex flex-wrap nowrap overflow-auto">
                {keys.map((key, i) => (
                  <div key={i} className="bg-neutral-200 p-2 rounded-lg m-1">
                    {key}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            label="Generate Key-Values"
            onClick={handleKeyValueTransform}
            small
            labelIcon={BracketsCurly}
            disabled={keys.length === 0}
          />
        </div>
      )}
      {selectedFile?.keyValueState === TransformState.TRANSFORMING && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-xl font-semibold text-neutral-500">Generating Key-Values</div>
          <PulsingIcon Icon={BracketsCurly} size={40} />
        </div>
      )}
      {selectedFile?.keyValueState === TransformState.DONE_TRANSFORMING && (
        <div className="flex flex-col items-start w-full h-full gap-4">
          <div className="flex flex-col items-start w-full h-full overflow-auto relative border-solid border-2 border-neutral-100 rounded-lg">
            <KeyValueTable keyValues={JSON.parse(selectedFile?.keyValueResult)} />
          </div>
          <div className={`w-full h-fit gap-4`}>
            <Button label="Download JSON" onClick={handleDownload} small labelIcon={DownloadSimple} />
          </div>
        </div>
      )}
    </>
  );
};

export default KeyValueContainer;
