import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useCallback, useEffect, useState } from 'react';
import Button from '../Button';
import axios, { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { PlaygroundFile, ExtractState } from '@/app/types/PlaygroundTypes';
import { DownloadSimple, FileMagnifyingGlass, CloudArrowUp } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import UploadButton from './UploadButton';
import pollJobStatus from '@/app/actions/pollJobStatus';
import { downloadFile } from '@/app/actions/downloadFile';
import { runJob } from '@/app/actions/runJob';
import ResultContainer from './ResultContainer';
import config from '../playground/config';
import { useProductionContext } from './ProductionContext';

const textStyles = 'text-xl font-semibold text-neutral-500';

const ExtractContainer = () => {
  const { apiURL } = useProductionContext();
  const { selectedFileIndex, files, filesFormData, updateFileAtIndex, token, clientId } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');

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
  }, [selectedFileIndex, files]);

  const handleDownload = useCallback(() => {
    if (selectedFile?.extractResult) {
      downloadFile({
        filename,
        fileContent: selectedFile.extractResult,
        fileType: 'text/plain',
        suffix: '_extracted.txt',
      });
    }
  }, [selectedFile, filename]);

  const handleSuccess = (response: AxiosResponse) => {
    console.log('extract content', response.data);
    const result = response.data.file_content;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      return;
    }
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.DONE_EXTRACTING);
    toast.success(`${filename} extracted!`);
    updateFileAtIndex(selectedFileIndex, 'extractResult', result);
    updateFileAtIndex(selectedFileIndex, 's3_file_source', response.data.file_source);
    return;
  };

  const handleError = (e: AxiosError) => {
    if (e.response) {
      if (e.response.status === 400) {
        toast.error(`${filename}: Parameter is invalid. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      } else if (e.response.status === 404) {
        toast.error(`${filename}: Job not found. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      } else if (e.response.status === 500) {
        toast.error(`${filename}: Job has failed. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        return;
      }
    }
    toast.error(`Error extracting ${filename}. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
    toast.error(`Extract request for ${filename} timed out. Please try again.`);
  };

  const handleFileExtract = async () => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.UPLOADING);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    console.log(`Extracting ${filename} | job_id: ${fileData?.jobId}`);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Please try again.`);
      return;
    }
    if (selectedFile && selectedFileIndex !== null) {
      runJob({
        api_url: apiURL,
        fileData,
        filename,
        selectedFile,
        selectedFileIndex,
        jobType: 'file_extraction',
        ...(config.AUTH0_ENABLED && { token }),
        updateFileAtIndex,
        handleSuccess,
        handleError,
        handleTimeout,
      });
    }
  };

  const handleHTMLExtract = async () => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.EXTRACTING);
    const params = {
      token: token,
      client_id: clientId,
      files: [
        {
          url: selectedFile?.file,
          source_type: 'url',
        },
      ],
      job_type: 'file_extraction',
    };
    axios
      .post(`${apiURL}/request`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(`${filename} submitted for extraction!`);
          updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.EXTRACTING);
          updateFileAtIndex(selectedFileIndex, 'jobId', response.data.jobId);
          updateFileAtIndex(selectedFileIndex, 'userId', response.data.userId);
          console.log(`Extracting ${filename} | job_id: $${response.data.jobId}`);
          setTimeout(() => {
            pollJobStatus({
              api_url: apiURL,
              getParams: { job_id: response.data.jobId, user_id: response.data.userId, job_type: 'file_extraction' },
              handleSuccess,
              handleError,
              handleTimeout,
            });
          }, 5000); // Need to delay the polling to give the server time to process the file
        } else {
          toast.error(`Error uploading ${filename}. Please try again.`);
          updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        }
      })
      .catch((error) => {
        console.error('error', error);
        toast.error(`Error uploading ${filename}. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      });
  };

  const handleExtract = async () => {
    if (typeof selectedFile?.file === 'string') {
      handleHTMLExtract();
    } else {
      handleFileExtract();
    }
  };

  return (
    <>
      {selectedFileIndex === null && (
        <div className="flex flex-col items-center justify-center h-full overflow-auto gap-4">
          <div className={textStyles}>Please upload a file.</div>
          <div className="w-[300px]">
            <UploadButton small />
          </div>
        </div>
      )}
      {selectedFile?.extractState === ExtractState.READY && (
        <div className="flex flex-col items-center justify-center gap-4 h-full text-lg text-center">
          {filename}
          <div className="w-[200px]">
            <Button label="Extract" onClick={handleExtract} small labelIcon={FileMagnifyingGlass} />
          </div>
        </div>
      )}
      {selectedFile?.extractState === ExtractState.UPLOADING && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className={textStyles}>Uploading</div>
          <PulsingIcon Icon={CloudArrowUp} size={40} />
        </div>
      )}
      {selectedFile?.extractState === ExtractState.EXTRACTING && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className={textStyles}>Extracting</div>
          <PulsingIcon Icon={FileMagnifyingGlass} size={40} />
        </div>
      )}
      {selectedFile?.extractState === ExtractState.DONE_EXTRACTING && (
        <div className="flex flex-col items-start w-full h-full gap-4 p-4">
          <ResultContainer extractResult={selectedFile.extractResult} />
          <div className="w-full h-fit">
            <Button
              label="Download Extracted Text"
              onClick={handleDownload}
              small
              disabled={selectedFile?.extractState !== ExtractState.DONE_EXTRACTING}
              labelIcon={DownloadSimple}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ExtractContainer;
