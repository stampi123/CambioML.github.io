import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ExtractTab, PlaygroundFile, ExtractState } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';
import Button from '../../Button';
import { ArrowCounterClockwise, DownloadSimple, Table } from '@phosphor-icons/react';
import PulsingIcon from '../../PulsingIcon';
import toast from 'react-hot-toast';
import { downloadFile } from '@/app/actions/downloadFile';
import { AxiosError, AxiosResponse } from 'axios';
import ResultContainer from '../ResultContainer';
import { useProductionContext } from '../ProductionContext';
import { runUploadRequestJob as runPreProdUploadRequestJob } from '@/app/actions/preprod/runUploadRequestJob';
import { runUploadRequestJob } from '@/app/actions/runUploadRequestJob';
import * as XLSX from 'xlsx';
import { SiMicrosoftexcel } from 'react-icons/si';
import { usePostHog } from 'posthog-js/react';

const TableExtractContainer = () => {
  const { apiURL, isProduction } = useProductionContext();
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
  }, [selectedFileIndex, files, updateFileAtIndex]);

  const handleSuccess = (response: AxiosResponse) => {
    let result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.READY);
      return;
    }
    result = result.filter((page: string) => page.length > 0);
    if (isProduction)
      posthog.capture('playground.table.extract_table.success', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
        num_pages: result.length,
      });
    updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.DONE_EXTRACTING);
    updateFileAtIndex(selectedFileIndex, 'tableExtractResult', result);
    toast.success(`Generated table(s) from ${filename}!`);
  };

  const handleError = (e: AxiosError) => {
    if (e.response) {
      if (e.response.status === 400) {
        toast.error(`${filename}: Parameter is invalid. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.READY);
        return;
      } else if (e.response.status === 404) {
        toast.error(`${filename}: Job not found. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.READY);
        return;
      } else if (e.response.status === 500) {
        toast.error(`${filename}: Job has failed. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.READY);
        return;
      }
    }
    if (isProduction)
      posthog.capture('playground.table.extract_table.error', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
        error_status: e.response?.status,
        error_message: e.response?.data,
      });
    toast.error(`Error transforming ${filename}. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.READY);
    toast.error(`Transform request for ${filename} timed out. Please try again.`);
  };

  const handleTableExtractTransform = async () => {
    if (isProduction)
      posthog.capture('playground.table.extract_table.button', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
      });
    if (selectedFile?.extractTab === ExtractTab.INITIAL_STATE) {
      updateFileAtIndex(selectedFileIndex, 'extractTab', ExtractTab.TABLE_EXTRACT);
    }
    updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.EXTRACTING);
    const fileData = filesFormData.find((obj) => obj.presignedUrl.fields['x-amz-meta-filename'] === filename);
    if (!fileData) {
      updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.READY);
      toast.error(`Error extracting ${filename}. Missing formData. Please try again.`);
      return;
    }

    if (selectedFileIndex === null || !selectedFile || !fileData) {
      toast.error(`Error extracting ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'tableExtractState', ExtractState.READY);
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
    if (!selectedFile?.tableExtractResult) {
      return;
    }
    if (isProduction)
      posthog.capture('playground.table.extract_table.download_html', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
      });
    downloadFile({
      filename,
      fileContent: selectedFile.tableExtractResult.join('\n\n'),
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
    if (!selectedFile?.tableExtractResult) {
      return;
    }
    if (isProduction)
      posthog.capture('playground.table.extract_table.download_xlsx', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
      });
    const htmlData = extractHTMLTables(selectedFile.tableExtractResult.join('\n\n'));
    const wb = XLSX.utils.book_new();
    htmlData.forEach((htmlTable, index) => {
      const table = document.createElement('table');
      table.innerHTML = htmlTable;

      const ws = XLSX.utils.table_to_sheet(table);
      XLSX.utils.book_append_sheet(wb, ws, `Table ${index + 1}`);
    });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    downloadFile({
      filename,
      fileContent: s2ab(wbout),
      fileType: 'application/octet-stream',
      suffix: `_extracted_table.xlsx`,
    });
  };

  const handleJsonDownload = () => {
    if (!selectedFile?.tableExtractResult) {
      return;
    }
    const htmlData = extractHTMLTables(selectedFile.tableExtractResult.join('\n\n'));
    htmlData.forEach((htmlTable) => {
      console.log(JSON.stringify(htmlTable, null, 2));
    });
  };

  const extractHTMLTables = (input: string): string[] => {
    const tableRegex = /<table>[\s\S]*?<\/table>/gm;
    const match = input.match(tableRegex);
    return match || [];
  };

  const handleRetry = () => {
    if (isProduction)
      posthog.capture('playground.table.extract_table.retry', {
        route: '/playground',
        module: 'table',
        submodule: 'extract_table',
        file_type: getFileType(),
      });
    updateFileAtIndex(selectedFileIndex, 'tableExtractResult', '');
    handleTableExtractTransform();
  };

  const getFileType = (): string => {
    let fileType = 'text/html';
    if (selectedFile?.file instanceof File) {
      fileType = selectedFile.file.type;
    }
    return fileType;
  };

  return (
    <>
      {selectedFile && (
        <>
          {selectedFile?.tableExtractState === ExtractState.READY && (
            <div className="flex flex-col items-center justify-center gap-4 h-full text-lg text-center">
              {filename}
              <div className="w-[200px]">
                <Button label="Extract Table" onClick={handleTableExtractTransform} small labelIcon={Table} />
              </div>
            </div>
          )}
          {selectedFile?.tableExtractState === ExtractState.EXTRACTING && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-xl font-semibold text-neutral-500">Generating HTML Table</div>
              <PulsingIcon Icon={Table} size={40} />
            </div>
          )}
          {selectedFile?.tableExtractState === ExtractState.DONE_EXTRACTING && (
            <div className="flex flex-col items-start w-full h-full gap-4">
              {selectedFile.tableExtractResult.length > 0 ? (
                <ResultContainer extractResult={selectedFile.tableExtractResult} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full overflow-auto">
                  <div className="text-xl font-semibold text-neutral-500">
                    No table detected in output. Retry or select another file
                  </div>
                </div>
              )}
              <div className={`w-full h-fit flex gap-4`}>
                <Button label="Retry" onClick={handleRetry} small labelIcon={ArrowCounterClockwise} />
                {selectedFile.tableExtractResult.length > 0 && selectedFile.tableExtractResult[0].length > 0 && (
                  <Button label="Download HTML" onClick={handleHtmlDownload} small labelIcon={DownloadSimple} />
                )}
                {extractHTMLTables(selectedFile.tableExtractResult.join('')).length > 0 && (
                  <>
                    {!isProduction && (
                      <Button label="Console Log JSON" onClick={handleJsonDownload} small labelIcon={DownloadSimple} />
                    )}
                    <Button
                      label="Download Excel"
                      onClick={handleHtmlXlsxDownload}
                      small
                      labelIcon={SiMicrosoftexcel}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TableExtractContainer;
