import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { TransformState, PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { AxiosError, AxiosResponse } from 'axios';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../Button';
import PulsingIcon from '../PulsingIcon';
import { ArrowCounterClockwise, DownloadSimple, GridNine } from '@phosphor-icons/react';
import QATable from './QATable';
import { downloadFile } from '@/app/actions/downloadFile';
import ResultContainer from './ResultContainer';
import { useProductionContext } from './ProductionContext';
import { runRequestJob } from '@/app/actions/runRequestJob';
import { runRequestJob as runPreProdRequestJob } from '@/app/actions/preprod/runRequestJob';

const QAContainer = () => {
  const { apiURL, isProduction } = useProductionContext();
  const { selectedFileIndex, files, token, clientId, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [displayTable, setDisplayTable] = useState<string[][] | null>(null);
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

  const updateDisplayTable = (resultList: string[][]) => {
    setDisplayTable(resultList);
  };

  const handleDownload = useCallback(() => {
    if (displayTable) {
      const columnNames = ['Context', 'Question', 'Answer'];
      const csvContent = [columnNames.map((value) => `"${value}"`).join(',')]
        .concat(displayTable.map((row) => row.map((value) => `"${value}"`).join(',')))
        .join('\n');
      downloadFile({
        filename,
        fileContent: csvContent,
        fileType: 'text/csv;charset=utf-8',
        suffix: '_QA_pairs.csv',
      });
    }
  }, [displayTable, filename]);

  const handleSuccess = (response: AxiosResponse) => {
    const result = response.data;
    if (result === undefined) {
      toast.error(`${filename}: Received undefined result. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.READY);
      return;
    }
    updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.DONE_TRANSFORMING);
    updateFileAtIndex(selectedFileIndex, 'qaResult', result);
    toast.success(`Generated QAs from ${filename}!`);
  };

  const handleError = (e: AxiosError) => {
    if (e.response) {
      if (e.response.status === 400) {
        toast.error(`${filename}: Parameter is invalid. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.READY);
        return;
      } else if (e.response.status === 404) {
        toast.error(`${filename}: Job not found. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.READY);
        return;
      } else if (e.response.status === 500) {
        toast.error(`${filename}: Job has failed. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.READY);
        return;
      }
    }
    toast.error(`Error transforming ${filename}. Please try again.`);
    updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.READY);
  };

  const handleTimeout = () => {
    updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.READY);
    toast.error(`Transform request for ${filename} timed out. Please try again.`);
  };

  const handleTransform = async () => {
    console.log(`Transforming ${filename} | job_id: ${selectedFile?.jobId}`);
    updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.TRANSFORMING);

    if (selectedFileIndex === null || selectedFile === undefined) {
      toast.error(`${filename}: missing selectedFileIndex or file. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.READY);
      return;
    }

    if (typeof selectedFile?.file === 'string') {
      const url = selectedFile?.file;

      if (typeof url !== 'string') {
        toast.error(`${filename}: invalid url. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'qaState', TransformState.READY);
        return;
      }

      if (isProduction) {
        runRequestJob({
          apiURL,
          clientId,
          token,
          jobType: 'qa_generation',
          sourceType: 'url',
          selectedFileIndex,
          filename,
          url,
          fileId: selectedFile.fileId,
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
          jobType: 'qa_generation',
          sourceType: 'url',
          selectedFileIndex,
          filename,
          url,
          fileId: selectedFile.fileId,
          handleError,
          handleSuccess,
          handleTimeout,
          updateFileAtIndex,
        });
      }
    } else {
      if (isProduction) {
        runRequestJob({
          apiURL,
          clientId,
          token,
          jobType: 'qa_generation',
          sourceType: 's3',
          fileId: selectedFile.fileId,
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
          jobType: 'qa_generation',
          sourceType: 's3',
          fileId: selectedFile.fileId,
          selectedFileIndex,
          filename,
          handleError,
          handleSuccess,
          handleTimeout,
          updateFileAtIndex,
        });
      }
    }
  };

  const handleRetry = () => {
    updateFileAtIndex(selectedFileIndex, 'qaResult', '');
    handleTransform();
  };

  return (
    <>
      {selectedFile?.qaState === TransformState.READY && (
        <div className="flex flex-col items-start w-full h-full gap-4">
          <ResultContainer extractResult={selectedFile.extractResult} />
          <div className={`w-full h-fit gap-4`}>
            <Button label="Generate Question-Answer Pairs" onClick={handleTransform} small labelIcon={GridNine} />
          </div>
        </div>
      )}
      {selectedFile?.qaState === TransformState.TRANSFORMING && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-xl font-semibold text-neutral-500">Generating QAs</div>
          <PulsingIcon Icon={GridNine} size={40} />
        </div>
      )}
      {selectedFile?.qaState === TransformState.DONE_TRANSFORMING &&
        Object.keys(selectedFile?.qaResult || {}).length &&
        selectedFile?.qaResult !== null && (
          <div className="flex flex-col items-start w-full h-full gap-4">
            <div className="flex flex-col items-start w-full h-full overflow-auto relative border-solid border-2 border-neutral-100 rounded-lg">
              <QATable qaResult={selectedFile?.qaResult} updateDisplayTable={updateDisplayTable} />
            </div>
            <div className="w-full h-fit flex gap-4">
              <Button label="Retry" onClick={handleRetry} small labelIcon={ArrowCounterClockwise} />
              <Button
                label="Download csv"
                onClick={handleDownload}
                small
                disabled={(Object.keys(selectedFile?.qaResult || {}).length || 0) === 0}
                labelIcon={DownloadSimple}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default QAContainer;
