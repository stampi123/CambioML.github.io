import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useCallback, useEffect, useState } from 'react';
import Button from '../Button';
import QATable from './QATable';
import { ExtractState, PlaygroundFile, TransformState } from '@/app/types/PlaygroundTypes';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { DownloadSimple, GridNine } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import Markdown from 'react-markdown';

const TransformContainer = () => {
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
      if (
        thisFile.extractState === ExtractState.DONE_EXTRACTING &&
        thisFile.transformState === TransformState.NO_DATA
      ) {
        updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
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
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const splitFilename = filename?.split('.')[0];

      const a = document.createElement('a');
      a.href = url;
      a.download = splitFilename + '_QA_pairs.csv';
      a.click();

      URL.revokeObjectURL(url);
    }
  }, [displayTable, filename]);

  const pollJobStatus = async () => {
    // Time out after 600 seconds
    const timeoutDuration = 600000; // 10 minutes
    const pollInterval = 200; // 200 milliseconds
    const startTime = Date.now();
    const job_id = selectedFile?.jobId;
    const user_id = selectedFile?.userId;
    const api_url = process.env.NEXT_PUBLIC_PLAYGROUND_API_URL;
    const GetJobStatusAPI: string = `${api_url}/sync?job_id=${job_id}&user_id=${user_id}&job_type=qa_generation`;
    const poll = async () => {
      if (Date.now() - startTime > timeoutDuration) {
        updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
        toast.error(`Transform request for ${filename} timed out. Please try again.`);
        return;
      }
      axios
        .get(GetJobStatusAPI)
        .then((response) => {
          if (response.status === 200) {
            const result = response.data;
            if (result === undefined) {
              toast.error(`${filename}: Received undefined result. Please try again.`);
              updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
              return;
            }
            updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.DONE_TRANSFORMING);
            updateFileAtIndex(selectedFileIndex, 'transformResult', result);
            toast.success(`Generated QAs from ${filename}!`);
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
              updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
              return;
            } else if (e.response.status === 404) {
              toast.error(`${filename}: Job not found. Please try again.`);
              updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
              return;
            } else if (e.response.status === 500) {
              toast.error(`${filename}: Job has failed. Please try again.`);
              updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
              return;
            }
          }
          toast.error(`Error transforming ${filename}. Please try again.`);
          updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
          return;
        });
    };

    // Start the polling process
    poll();
  };

  const handleTransform = () => {
    updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.TRANSFORMING);
    const api_url = process.env.NEXT_PUBLIC_PLAYGROUND_API_URL;
    const s3_file_source = selectedFile?.s3_file_source;
    if (!s3_file_source) {
      toast.error(`${filename}: missing s3_file_source. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
      return;
    }
    s3_file_source['source_type'] = 'dynamodb';
    const params = {
      token: token,
      client_id: clientId,
      files: [s3_file_source],
      job_type: 'qa_generation',
      job_id: selectedFile?.jobId,
    };
    axios
      .post(`${api_url}/request`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setTimeout(() => {
          pollJobStatus();
        }, 5000); // Need to delay the polling to give the server time to process the file
      })
      .catch((error) => {
        console.error('error', error);
        toast.error(`Error transforming ${filename}. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'transformState', TransformState.READY);
      });
  };

  return (
    <div className="w-full h-full pb-4 grid grid-rows-[1fr_50px] gap-4">
      <div className="border border-solid border-2 border-neutral-200 rounded-b-xl overflow-auto grid-row-1">
        {selectedFile?.transformState === TransformState.NO_DATA && (
          <div className="flex flex-col items-center justify-center h-full overflow-auto">
            <div className="text-xl font-semibold text-neutral-500">Please extract the data first.</div>
          </div>
        )}
        {selectedFile?.transformState === TransformState.READY && (
          <div className="flex flex-col items-start w-full h-full p-4 gap-4">
            <div className="overflow-auto relative w-full h-full bg-neutral-100 text-neutral-500 rounded-lg">
              <Markdown className="markdown absolute p-4  whitespace-pre-wrap w-full h-full">
                {selectedFile.extractResult}
              </Markdown>
            </div>
            <Button label="Generate Question-Answer Pairs" onClick={handleTransform} small labelIcon={GridNine} />
          </div>
        )}
        {selectedFile?.transformState === TransformState.TRANSFORMING && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-xl font-semibold text-neutral-500">Generating QAs</div>
            <PulsingIcon Icon={GridNine} size={40} />
          </div>
        )}
        {selectedFile?.transformState === TransformState.DONE_TRANSFORMING &&
          Object.keys(selectedFile?.transformResult || {}).length && (
            <div className="flex flex-col items-start w-full h-full overflow-auto relative">
              <QATable transformResult={selectedFile?.transformResult} updateDisplayTable={updateDisplayTable} />
            </div>
          )}
      </div>
      <div className="w-full flex items-center justify-center grid-row-1">
        <div className="w-[60%] min-w-[30px]">
          <Button
            label="Download csv"
            onClick={handleDownload}
            small
            disabled={(Object.keys(selectedFile?.transformResult || {}).length || 0) === 0}
            labelIcon={DownloadSimple}
          />
        </div>
      </div>
    </div>
  );
};

export default TransformContainer;
