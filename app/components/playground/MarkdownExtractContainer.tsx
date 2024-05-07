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
    const result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      return;
    }
    if (typeof result === 'string') {
      updateFileAtIndex(selectedFileIndex, 'extractResult', [result]);
    } else {
      updateFileAtIndex(selectedFileIndex, 'extractResult', result);
    }

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
    toast.error(`Error extracting ${filename}. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
    toast.error(`Extract request for ${filename} timed out. Please try again.`);
  };

  const handleFileExtract = async () => {
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

  const handleMarkdownCSVDownload = () => {
    if (!selectedFile?.extractResult) {
      return;
    }
    const markdownData = extractMarkdownTables(selectedFile.extractResult.join('\n\n'));
    markdownData.forEach((markdown, index) => {
      const rows = markdown.split('\n');
      const nonEmptyRows = rows.filter((row) => row.trim() !== '');
      const headers = nonEmptyRows[0]
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim());
      const dataRows = nonEmptyRows.slice(2); // Exclude header rows

      let csvContent = headers.join(',') + '\n';
      csvContent += dataRows
        .map((row) => {
          const cells = row.split('|').map((cell) => cell.trim());
          return cells
            .slice(1, cells.length - 1)
            .map((cell) => `"${cell.replace(/"/g, '""')}"`)
            .join(',');
        })
        .join('\n');

      downloadFile({
        filename,
        fileContent: csvContent,
        fileType: 'text/csv',
        suffix: `_extracted_table_${index}.csv`,
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
            {!isProduction && extractMarkdownTables(selectedFile.extractResult.join('\n\n')).length > 0 && (
              <Button label="Download Table CSV" onClick={handleMarkdownCSVDownload} small labelIcon={DownloadSimple} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MarkdownExtractContainer;
