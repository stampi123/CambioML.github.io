import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile, TransformState } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import Button from '../Button';
import { ArrowCounterClockwise, DownloadSimple, Table } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import toast from 'react-hot-toast';
import { downloadFile } from '@/app/actions/downloadFile';
import { AxiosError, AxiosResponse } from 'axios';
import ResultContainer from './ResultContainer';
import { useProductionContext } from './ProductionContext';
import { runUploadRequestJob as runPreProdUploadRequestJob } from '@/app/actions/preprod/runUploadRequestJob';
import { runUploadRequestJob } from '@/app/actions/runUploadRequestJob';
import * as XLSX from 'xlsx';
import { extractMarkdownTables } from './ExtractContainer';

const KeyValueContainer = () => {
  const { apiURL, isProduction } = useProductionContext();
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
  }, [selectedFileIndex, files, updateFileAtIndex]);

  const handleSuccess = (response: AxiosResponse) => {
    const result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
      return;
    }
    updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.DONE_TRANSFORMING);
    updateFileAtIndex(selectedFileIndex, 'keyValueResult', result);
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

  const handleKeyValueTransform = async () => {
    updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.TRANSFORMING);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
      toast.error(`Error extracting ${filename}. Missing formData. Please try again.`);
      return;
    }

    if (selectedFileIndex === null || !selectedFile || !fileData) {
      toast.error(`Error extracting ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
      return;
    }
    if (isProduction) {
      runUploadRequestJob({
        api_url: apiURL,
        clientId,
        token,
        sourceType: 's3',
        selectedFile,
        fileData,
        jobType: 'info_extraction',
        jobParams: {
          user_prompt: '',
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
      runPreProdUploadRequestJob({
        api_url: apiURL,
        clientId,
        token,
        sourceType: 's3',
        selectedFile,
        fileData,
        jobType: 'info_extraction',
        jobParams: {
          user_prompt: '',
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

  const handleHtmlDownload = () => {
    if (!selectedFile?.keyValueResult) {
      return;
    }
    downloadFile({
      filename,
      fileContent: selectedFile.keyValueResult.join('\n\n'),
      fileType: 'text/html',
      suffix: '_extracted_table.html',
    });
  };

  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const handleHtmlXlsxDownload = () => {
    if (!selectedFile?.keyValueResult) {
      return;
    }
    const htmlData = extractHTMLTables(selectedFile.keyValueResult.join('\n\n'));
    htmlData.forEach((htmlTable, index) => {
      const table = document.createElement('table');
      table.innerHTML = htmlTable;

      const ws = XLSX.utils.table_to_sheet(table);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      downloadFile({
        filename,
        fileContent: s2ab(wbout),
        fileType: 'application/octet-stream',
        suffix: `_extracted_table${index > 0 ? '_' + index : ''}.xlsx`,
      });
    });
  };

  const extractHTMLTables = (input: string): string[] => {
    const tableRegex = /<table>[\s\S]*?<\/table>/gm;
    const match = input.match(tableRegex);
    return match || [];
  };

  const handleRetry = () => {
    updateFileAtIndex(selectedFileIndex, 'keyValueResult', '');
    updateFileAtIndex(selectedFileIndex, 'keyValueState', TransformState.READY);
  };

  return (
    <>
      {selectedFile && (
        <>
          {extractMarkdownTables(selectedFile.extractResult.join('')).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full overflow-auto gap-4">
              <div className="text-xl font-semibold text-neutral-500">
                No table detected. Please choose a file with a table.
              </div>
            </div>
          ) : (
            <>
              {selectedFile?.keyValueState === TransformState.READY && (
                <div className="flex flex-col items-start w-full h-full gap-4">
                  <ResultContainer extractResult={selectedFile.extractResult} />
                  <Button label="Generate HTML Table" onClick={handleKeyValueTransform} small labelIcon={Table} />
                </div>
              )}
              {selectedFile?.keyValueState === TransformState.TRANSFORMING && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-xl font-semibold text-neutral-500">Generating HTML Table</div>
                  <PulsingIcon Icon={Table} size={40} />
                </div>
              )}
              {selectedFile?.keyValueState === TransformState.DONE_TRANSFORMING && (
                <div className="flex flex-col items-start w-full h-full gap-4">
                  <ResultContainer extractResult={selectedFile.keyValueResult} />
                  <div className={`w-full h-fit flex gap-4`}>
                    <Button label="Retry" onClick={handleRetry} small labelIcon={ArrowCounterClockwise} />
                    <Button label="Download HTML" onClick={handleHtmlDownload} small labelIcon={DownloadSimple} />
                    {extractHTMLTables(selectedFile.keyValueResult.join('')).length > 0 && (
                      <Button
                        label="Download Excel"
                        onClick={handleHtmlXlsxDownload}
                        small
                        labelIcon={DownloadSimple}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default KeyValueContainer;
