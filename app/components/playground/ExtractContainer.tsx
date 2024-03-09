import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useCallback, useEffect, useState } from 'react';
import Button from '../Button';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { PlaygroundFile, ExtractState } from '@/app/types/PlaygroundTypes';
import { DownloadSimple, FileMagnifyingGlass, CloudArrowUp } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import Markdown from 'react-markdown';

const ExtractContainer = () => {
  const { selectedFileIndex, files, filesFormData, updateFileAtIndex } = usePlaygroundStore();
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
      const blob = new Blob([selectedFile.extractResult], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const splitFilename = filename?.split('.')[0];

      const a = document.createElement('a');
      a.href = url;
      a.download = splitFilename + '_extracted.txt';
      a.click();

      URL.revokeObjectURL(url);
    }
  }, [selectedFile, filename]);

  const pollJobStatus = async (jobId: string, userId: string) => {
    // Time out after 600 seconds
    const timeoutDuration = 600000; // 10 minutes
    const pollInterval = 200; // 200 milliseconds
    const startTime = Date.now();
    const job_id = jobId;
    const user_id = userId;
    const api_url = process.env.NEXT_PUBLIC_PLAYGROUND_API_URL;
    const GetJobStatusAPI: string = `${api_url}/sync?job_id=${job_id}&user_id=${user_id}&job_type=file_extraction`;
    const poll = async () => {
      if (Date.now() - startTime > timeoutDuration) {
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        toast.error(`Extract request for ${filename} timed out. Please try again.`);
        return;
      }
      axios
        .get(GetJobStatusAPI)
        .then((response) => {
          if (response.status === 200) {
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
          } else if (response.status === 202) {
            setTimeout(poll, pollInterval);
          } else {
            return;
          }
        })
        .catch((e: AxiosError) => {
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
          return;
        });
    };

    // Start the polling process
    poll();
  };

  const handlePDFExtract = async () => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.UPLOADING);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Please refresh the page and try again.`);
      return;
    }
    const postData = new FormData();
    Object.entries(fileData.presignedUrl.fields).forEach(([key, value]) => {
      postData.append(key, value);
    });

    postData.append('file', selectedFile?.file || '');

    axios
      .post(fileData.presignedUrl.url, postData)
      .then((response) => {
        if (response.status === 204) {
          toast.success(`${filename} uploaded`);
          updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.EXTRACTING);
          updateFileAtIndex(selectedFileIndex, 'jobId', fileData.jobId);
          updateFileAtIndex(selectedFileIndex, 'userId', fileData.userId);
          setTimeout(() => {
            pollJobStatus(fileData.jobId, fileData.userId);
          }, 10000); // Need to delay the polling to give the server time to process the file
        } else {
          toast.error(`Error uploading ${filename}. Please refresh the page and try again.`);
          updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
        }
      })
      .catch((error) => {
        console.error('error', error);
        toast.error(`Error uploading ${filename}. Please refresh the page and try again.`);
      });
  };

  const handleHTMLExtract = async () => {
    toast.success(`extracting ${selectedFile?.file}`);
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.EXTRACTING);
    setTimeout(() => {
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
    }, 2000);
  };

  const handleExtract = async () => {
    if (typeof selectedFile?.file === 'string') {
      handleHTMLExtract();
    } else {
      handlePDFExtract();
    }
  };

  return (
    <div className="w-full h-full pb-4 grid grid-rows-[1fr_50px] gap-4">
      <div className="border border-solid border-2 border-neutral-200 rounded-b-xl grid-row-1">
        {selectedFileIndex === null && (
          <div className="flex flex-col items-center justify-center h-full overflow-auto">
            <div className="text-xl font-semibold text-neutral-500">Please upload a file.</div>
          </div>
        )}
        {selectedFile?.extractState === ExtractState.READY && (
          <div className="flex flex-col items-center justify-center gap-4 h-full text-lg">
            {filename}
            <div className="w-[200px]">
              <Button label="Extract" onClick={handleExtract} small labelIcon={FileMagnifyingGlass} />
            </div>
          </div>
        )}
        {selectedFile?.extractState === ExtractState.UPLOADING && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="text-xl font-semibold text-neutral-500">Uploading</div>
            <PulsingIcon Icon={CloudArrowUp} size={40} />
          </div>
        )}
        {selectedFile?.extractState === ExtractState.EXTRACTING && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="text-xl font-semibold text-neutral-500">Extracting</div>
            <PulsingIcon Icon={FileMagnifyingGlass} size={40} />
          </div>
        )}
        {selectedFile?.extractState === ExtractState.DONE_EXTRACTING && (
          <div className="flex flex-col items-start w-full h-full p-4 gap-4">
            <div className="text-xl flex w-full justify-center font-semibold">{`${filename} Extracted Content`}</div>
            <div className="overflow-auto relative w-full h-full bg-neutral-100 rounded-lg">
              <Markdown className="text-lg p-4 absolute">{selectedFile.extractResult}</Markdown>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex items-center justify-center grid-row-1">
        <div className="w-[60%] min-w-[30px]">
          <Button
            label="Download txt"
            onClick={handleDownload}
            small
            disabled={selectedFile?.extractState !== ExtractState.DONE_EXTRACTING}
            labelIcon={DownloadSimple}
          />
        </div>
      </div>
    </div>
  );
};

export default ExtractContainer;
