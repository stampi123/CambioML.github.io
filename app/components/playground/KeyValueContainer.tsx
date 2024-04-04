import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile, TransformState } from '@/app/types/PlaygroundTypes';
import { useCallback, useEffect, useState } from 'react';
import Button from '../Button';
import { BracketsCurly, DownloadSimple } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import toast from 'react-hot-toast';
import InputBasic from '../inputs/InputBasic';
import { downloadFile } from '@/app/actions/downloadFile';
import axios, { AxiosResponse } from 'axios';
import ExtractResultContainer from './ExtractResultContainer';

const MIN_INPUT_LENGTH = 50;

const KeyValueContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex, filesFormData } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');

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

  // const handleSuccess = (response: AxiosResponse) => {
  //   const result = response.data;
  //   if (result === undefined) {
  //     toast.error(`${filename}: Received undefined result. Please try again.`);
  //     updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
  //     return;
  //   }
  //   updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.DONE_TRANSFORMING);
  //   updateFileAtIndex(selectedFileIndex, 'keyValueResult', result);
  //   toast.success(`Generated QAs from ${filename}!`);
  // };

  // const handleError = (e: AxiosError) => {
  //   if (e.response) {
  //     if (e.response.status === 400) {
  //       toast.error(`${filename}: Parameter is invalid. Please try again.`);
  //       updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
  //       return;
  //     } else if (e.response.status === 404) {
  //       toast.error(`${filename}: Job not found. Please try again.`);
  //       updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
  //       return;
  //     } else if (e.response.status === 500) {
  //       toast.error(`${filename}: Job has failed. Please try again.`);
  //       updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
  //       return;
  //     }
  //   }
  //   toast.error(`Error transforming ${filename}. Please try again.`);
  //   updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
  // };

  // const handleTimeout = () => {
  //   updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
  //   toast.error(`Transform request for ${filename} timed out. Please try again.`);
  // };

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
    toast.success(`Generating Key-Values for ${filename}`);
    updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.TRANSFORMING);
    const jobId = selectedFile?.jobId;
    const userId = selectedFile?.userId;
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);

    const params = {
      userId,
      jobId,
      fileKey: fileData?.presignedUrl.fields.key,
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_PLAYGROUND_API_URL}/cambio_api/parse`, params, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_PLAYGROUND_API_KEY,
        },
      })
      .then((response: AxiosResponse) => {
        console.log('Response', response.data);
        const parsedResult = JSON.parse(response.data.result);
        console.log('Parsed Result', parsedResult);
        if (parsedResult === undefined) {
          toast.error(`${filename}: Received undefined result. Please try again.`);
          updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
          return;
        }
        const result = parsedResult.results[0].result;
        toast.success(`Generated Key-Values from ${filename}!`);
        updateFileAtIndex(selectedFileIndex, 'keyValueResult', JSON.stringify(result, null, 2));
        updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.DONE_TRANSFORMING);
      })
      .catch((error) => {
        console.error('error', error);
        toast.error(`Error generating key-value for ${filename}. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
      });
  };

  return (
    <>
      {selectedFile?.keyValueState === TransformState.READY && (
        <div className="flex flex-col items-start w-full h-full gap-4">
          <ExtractResultContainer extractResult={selectedFile.extractResult} />
          <div className={`w-full h-fit gap-4 grid grid-cols-[2fr_1fr]`}>
            <InputBasic label="Data Query" value={query} onChange={handleQueryChange} error={inputError} />
            <Button
              label="Generate Key-Values"
              onClick={handleKeyValueTransform}
              small
              labelIcon={BracketsCurly}
              disabled={query.length < MIN_INPUT_LENGTH && inputError === ''}
            />
          </div>
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
          <div className="overflow-auto relative w-full h-full bg-neutral-100 text-neutral-700 rounded-lg p-4">
            <pre className="p-4 whitespace-pre-wrap absolute">{selectedFile.keyValueResult}</pre>
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
