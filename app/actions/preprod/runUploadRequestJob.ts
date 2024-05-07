import axios, { AxiosError, AxiosResponse } from 'axios';
import { CompareState, ExtractState, PlaygroundFile, TransformState } from '../../types/PlaygroundTypes';
import toast from 'react-hot-toast';
import { PresignedResponse } from './apiInterface';
import { runRequestJob } from './runRequestJob';

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

interface IParams {
  api_url: string;
  clientId: string;
  fileData: PresignedResponse;
  filename: string;
  jobType: string;
  jobParams?: { [key: string]: string | boolean };
  selectedFileIndex: number;
  selectedFile: PlaygroundFile;
  sourceType: string;
  token: string;
  handleSuccess: (response: AxiosResponse) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  updateFileAtIndex: (
    index: number | null,
    property: string,
    value: string | ExtractState | TransformState | CompareState | File
  ) => void;
}

export const runUploadRequestJob = async ({
  api_url,
  clientId,
  fileData,
  filename,
  jobParams,
  jobType,
  selectedFile,
  sourceType,
  selectedFileIndex,
  token,
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
        updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], SUCCESS_STATE[jobType]);
        runRequestJob({
          apiURL: api_url,
          clientId,
          token,
          sourceType,
          fileId: fileData.fileId,
          jobType,
          jobParams,
          selectedFileIndex,
          filename,
          handleError,
          handleSuccess,
          handleTimeout,
          updateFileAtIndex,
        });
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
