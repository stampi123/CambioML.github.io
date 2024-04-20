import axios, { AxiosError, AxiosResponse } from 'axios';
import { ExtractState, TransformState } from '../types/PlaygroundTypes';
import pollJobStatus from './pollJobStatus';
import toast from 'react-hot-toast';

interface IParams {
  apiURL: string;
  jobType: string;
  jobId?: string;
  token: string;
  clientId: string;
  selectedFileIndex: number;
  files: {
    [key: string]: string | boolean;
  }[];
  filename: string;
  handleSuccess: (response: AxiosResponse) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  updateFileAtIndex: (
    index: number | null,
    property: string,
    value: string | ExtractState | TransformState | File
  ) => void;
}

const JOB_STATE: { [key: string]: string } = {
  file_extraction: 'extractState',
  info_extraction: 'keyValueState',
  qa_generation: 'qaState',
};

const SUCCESS_STATE: { [key: string]: ExtractState | TransformState } = {
  file_extraction: ExtractState.EXTRACTING,
  info_extraction: TransformState.TRANSFORMING,
  qa_generation: TransformState.TRANSFORMING,
};

const FAIL_STATE: { [key: string]: ExtractState | TransformState } = {
  file_extraction: ExtractState.READY,
  info_extraction: TransformState.READY,
  qa_generation: TransformState.READY,
};

const SLEEP_DURATION: { [key: string]: number } = {
  file_extraction: 2000,
  info_extraction: 5000,
  qa_generation: 5000,
};

export const runRequestJob = async ({
  apiURL,
  clientId,
  token,
  files,
  jobId,
  jobType,
  selectedFileIndex,
  filename,
  handleError,
  handleSuccess,
  handleTimeout,
  updateFileAtIndex,
}: IParams) => {
  const params = {
    token,
    client_id: clientId,
    files,
    job_type: jobType,
    ...(jobId && { job_id: jobId }),
  };
  console.log('init job id', jobId);
  axios
    .post(`${apiURL}/request`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        toast.success(`${filename} submitted!`);
        updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], SUCCESS_STATE[jobType]);
        updateFileAtIndex(selectedFileIndex, 'jobId', response.data.jobId);
        updateFileAtIndex(selectedFileIndex, 'userId', response.data.userId);
        console.log(`Transforming ${filename} | job_id: $${response.data.jobId}`);
        setTimeout(() => {
          pollJobStatus({
            api_url: apiURL,
            getParams: {
              job_id: response.data.jobId,
              user_id: response.data.userId,
              job_type: jobType,
            },
            handleSuccess,
            handleError,
            handleTimeout,
          });
        }, SLEEP_DURATION[jobType]); // Need to delay the polling to give the server time to process the file
      } else {
        toast.error(`Error uploading ${filename}. Please try again.`);
        updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], FAIL_STATE[jobType]);
      }
    })
    .catch((error) => {
      console.error('error', error);
      toast.error(`Error uploading ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], FAIL_STATE[jobType]);
    });
};
