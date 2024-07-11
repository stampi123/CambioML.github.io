import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useCallback, useEffect, useState } from 'react';
import Button from '../Button';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { PlaygroundFile, ExtractState, ExtractTab } from '@/app/types/PlaygroundTypes';
import { DownloadSimple, CloudArrowUp, ArrowCounterClockwise, FileText } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import { downloadFile } from '@/app/actions/downloadFile';
import { runExtractJob } from '@/app/actions/runExtractJob';
import { runExtractJob as runPreProdExtractJob } from '@/app/actions/preprod/runExtractJob';
import { runRequestJob } from '@/app/actions/runRequestJob';
import { runRequestJob as runPreProdRequestJob } from '@/app/actions/preprod/runRequestJob';
import ResultContainer from './ResultContainer';
import { useProductionContext } from './ProductionContext';
import { usePostHog } from 'posthog-js/react';

const textStyles = 'text-xl font-semibold text-neutral-500';

export const extractMarkdownTables = (input: string): string[] => {
  const tableRegex = /\|(.*\|.+\|[\s\S]*\|.+\|)/gm;
  const match = input.match(tableRegex);

  return match || [];
};

const MarkdownExtractContainer = () => {
  const { isProduction, apiURL } = useProductionContext();
  const { selectedFileIndex, files, filesFormData, updateFileAtIndex, token, clientId } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [filename, setFilename] = useState<string>('');
  const posthog = usePostHog();

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
        fileContent: selectedFile.extractResult.join('\n\n'),
        fileType: 'text/plain',
        suffix: '_extracted.txt',
      });
    }
  }, [selectedFile, filename]);

  const handleSuccess = (response: AxiosResponse) => {
    let result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      return;
    }
    if (typeof result === 'string') {
      result = [result];
    }
    updateFileAtIndex(selectedFileIndex, 'extractResult', result);
    if (isProduction)
      posthog.capture('playground.extract.plain_text.success', { route: '/playground', pages: result.length });

    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.DONE_EXTRACTING);
    toast.success(`${filename} extracted!`);
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
    if (isProduction) posthog.capture('playground.extract.plain_text.error', { route: '/playground' });
    toast.error(`Error extracting ${filename}. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
    toast.error(`Extract request for ${filename} timed out. Please try again.`);
  };

  const handleFileExtract = async () => {
    if (isProduction) posthog.capture('playground.extract.plain_text.button', { route: '/playground' });
    if (selectedFile?.extractTab === ExtractTab.INITIAL_STATE) {
      updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.FILE_EXTRACT);
    }
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.UPLOADING);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Please try again.`);
      return;
    }
    if (selectedFile && selectedFileIndex !== null) {
      if (isProduction) {
        runExtractJob({
          api_url: apiURL,
          fileData,
          filename,
          selectedFile,
          selectedFileIndex,
          token,
          queryType: 'job_result',
          updateFileAtIndex,
          handleSuccess,
          handleError,
          handleTimeout,
        });
      } else {
        runPreProdExtractJob({
          api_url: apiURL,
          fileData,
          filename,
          selectedFile,
          selectedFileIndex,
          token,
          queryType: 'job_result',
          updateFileAtIndex,
          handleSuccess,
          handleError,
          handleTimeout,
        });
      }
    }
  };

  const handleHTMLExtract = async () => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.EXTRACTING);

    if (selectedFileIndex === null || !selectedFile || typeof selectedFile.file !== 'string') {
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Please try again.`);
      return;
    }

    if (isProduction) {
      runRequestJob({
        apiURL,
        clientId,
        token,
        fileId: selectedFile.fileId,
        jobType: 'file_extraction',
        selectedFileIndex,
        sourceType: 'url',
        url: selectedFile.file,
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
        fileId: selectedFile.fileId,
        jobType: 'file_extraction',
        selectedFileIndex,
        sourceType: 'url',
        url: selectedFile.file,
        filename,
        handleError,
        handleSuccess,
        handleTimeout,
        updateFileAtIndex,
      });
    }
  };

  const handleExtract = async () => {
    if (typeof selectedFile?.file === 'string') {
      handleHTMLExtract();
    } else {
      handleFileExtract();
    }
  };

  const handleRetry = () => {
    updateFileAtIndex(selectedFileIndex, 'extractResult', []);
    handleExtract();
  };

  const handleDownloadTableJson = () => {
    if (!selectedFile?.extractResult) {
      return;
    }
    const markdownData = extractMarkdownTables(selectedFile.extractResult.join('\n\n'));
    markdownData.forEach((markdownTable, index) => {
      const lines = markdownTable.trim().split('\n');
      const headers = lines[0]
        .split('|')
        .slice(1, -1)
        .map((header) => header.trim());
      const json: { [key: string]: { [key: string]: string } } = {};

      for (let i = 2; i < lines.length; i++) {
        const row = lines[i]
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim());
        const unitDescription = row[0];

        for (let j = 1; j < headers.length; j++) {
          let header = headers[j];
          let count = 1;
          while (json[header] && json[header][unitDescription] !== undefined) {
            header = `${headers[j]}_${count}`;
            count++;
          }
          if (!json[header]) json[header] = {};
          json[header][unitDescription] = row[j];
        }
      }
      downloadFile({
        filename,
        fileContent: JSON.stringify(json, null, 2),
        fileType: 'application/json',
        suffix: `_extracted_table${index > 0 ? '_' + index : ''}.json`,
      });
    });
  };

  return (
    <>
      {selectedFile?.extractState === ExtractState.READY && (
        <div className="flex flex-col items-center justify-center gap-4 h-full text-lg text-center">
          {filename}
          <div className="w-[200px]">
            <Button label="Extract Plain Text" onClick={handleExtract} small labelIcon={FileText} />
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
          <PulsingIcon Icon={FileText} size={40} />
        </div>
      )}
      {selectedFile?.extractState === ExtractState.DONE_EXTRACTING && (
        <div className="flex flex-col items-start w-full h-full gap-4 p-4">
          <ResultContainer extractResult={selectedFile.extractResult} />
          <div className="w-full h-fit flex gap-4">
            <Button label="Retry" onClick={handleRetry} small labelIcon={ArrowCounterClockwise} />
            <Button
              label="Download Markdown Text"
              onClick={handleDownload}
              small
              disabled={selectedFile?.extractState !== ExtractState.DONE_EXTRACTING}
              labelIcon={DownloadSimple}
            />
            {extractMarkdownTables(selectedFile.extractResult.join('\n\n')).length > 0 && (
              // <Button label="Download Table CSV" onClick={handleMarkdownCSVDownload} small labelIcon={DownloadSimple} />
              <Button label="Download Table JSON" onClick={handleDownloadTableJson} small labelIcon={DownloadSimple} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MarkdownExtractContainer;
