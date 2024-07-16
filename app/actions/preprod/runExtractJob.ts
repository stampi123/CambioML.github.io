import axios, { AxiosError, AxiosResponse } from 'axios';
import { CompareState, ExtractState, PlaygroundFile, TransformState } from '../../types/PlaygroundTypes';
import pollJobStatus from './pollJobStatus';
import toast from 'react-hot-toast';
import { QueryParams, PresignedResponse } from './apiInterface';

interface IParams {
  api_url: string;
  fileData: PresignedResponse;
  filename: string;
  selectedFileIndex: number;
  selectedFile: PlaygroundFile;
  queryType: string;
  token: string;
  handleSuccess: (response: AxiosResponse, page?: number) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  updateFileAtIndex: (
    index: number | null,
    property: string,
    value: string | ExtractState | TransformState | CompareState | File
  ) => void;
}

export const runExtractJob = async ({
  api_url,
  fileData,
  filename,
  selectedFile,
  selectedFileIndex,
  queryType,
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
  const postParams: QueryParams = {
    userId: fileData.userId,
    fileId: fileData.fileId,
    queryType,
    jobId: fileData.jobId,
  };

  axios
    .post(fileData.presignedUrl.url, postData)
    .then((response) => {
      if (response.status === 204) {
        toast.success(`${filename} uploaded!`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.EXTRACTING);
        setTimeout(() => {
          pollJobStatus({
            api_url,
            postParams,
            handleSuccess,
            handleError,
            handleTimeout,
            token,
          });
        }, 5000); // Need to delay the polling to give the server time to process the file
      } else {
        toast.error(`Error uploading ${filename}. Please try again.`);
        updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
      }
    })
    .catch((error) => {
      console.error('error', error);
      toast.error(`Error uploading ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, 'extractState', ExtractState.READY);
    });
};
