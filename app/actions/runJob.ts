import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  CompareState,
  ExtractState,
  PlaygroundFile,
  PresignedResponse,
  TransformState,
} from '../types/PlaygroundTypes';
import pollJobStatus from './pollJobStatus';
import toast from 'react-hot-toast';

interface IParams {
  fileData: PresignedResponse;
  filename: string;
  selectedFileIndex: number;
  selectedFile: PlaygroundFile;
  jobType: string;
  handleSuccess: (response: AxiosResponse) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  updateFileAtIndex: (
    index: number | null,
    property: string,
    value: string | ExtractState | TransformState | CompareState | File
  ) => void;
}

const JOB_STATE: { [key: string]: string } = {
  file_extraction: 'extractState',
  file_comparison: 'compareState',
};

const SUCCESS_STATE: { [key: string]: ExtractState | TransformState | CompareState } = {
  file_extraction: ExtractState.EXTRACTING,
  file_comparison: CompareState.COMPARING,
};

const FAIL_STATE: { [key: string]: ExtractState | TransformState | CompareState } = {
  file_extraction: ExtractState.READY,
  file_comparison: CompareState.READY,
};

const SLEEP_DURATION: { [key: string]: number } = {
  file_extraction: 20000,
  file_comparison: 30000,
};

export const runJob = async ({
  fileData,
  filename,
  selectedFile,
  selectedFileIndex,
  jobType,
  updateFileAtIndex,
  handleSuccess,
  handleError,
  handleTimeout,
}: IParams) => {
  const postData = new FormData();
  Object.entries(fileData.presignedUrl.fields).forEach(([key, value]) => {
    postData.append(key, value);
  });

  postData.append('file', selectedFile?.file || '');

  axios
    .post(fileData.presignedUrl.url, postData)
    .then((response) => {
      if (response.status === 204) {
        toast.success(`${filename} uploaded!`);
        updateFileAtIndex(
          selectedFileIndex,
          JOB_STATE[jobType] || 'extractState',
          SUCCESS_STATE[jobType] || ExtractState.READY
        );
        updateFileAtIndex(selectedFileIndex, 'jobId', fileData.jobId);
        updateFileAtIndex(selectedFileIndex, 'userId', fileData.userId);
        setTimeout(() => {
          pollJobStatus({
            getParams: { job_id: fileData.jobId, user_id: fileData.userId, job_type: jobType },
            handleSuccess,
            handleError,
            handleTimeout,
          });
        }, SLEEP_DURATION[jobType]); // Need to delay the polling to give the server time to process the file
      } else {
        toast.error(`Error uploading ${filename}. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', FAIL_STATE[jobType] || ExtractState.READY);
      }
    })
    .catch((error) => {
      console.error('error', error);
      toast.error(`Error uploading ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'extractState', FAIL_STATE[jobType] || ExtractState.READY);
    });
};
