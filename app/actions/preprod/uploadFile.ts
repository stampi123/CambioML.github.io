import axios from 'axios';
import toast from 'react-hot-toast';
import { PresignedResponse, UploadParams } from './apiInterface';
import { AddFileParams } from '../../hooks/usePlaygroundStore';

interface IParams {
  api_url: string;
  file: File | undefined;
  token: string;
  clientId: string;
  addFilesFormData: (data: PresignedResponse) => void;
  addFiles: ({ files, fileId, jobId, userId }: AddFileParams) => void;
}

interface Config {
  params: UploadParams;
  headers?: { authorizationToken: string };
}

export const uploadFile = async ({ api_url, file, token, clientId, addFiles, addFilesFormData }: IParams) => {
  if (!file) {
    toast.error('No file selected');
    return;
  }
  const file_name = file.name;
  const getConfig: Config = {
    params: {
      token: token,
      clientId: clientId,
      fileName: file_name,
    },
    headers: { authorizationToken: token },
  };

  return await axios
    .get<PresignedResponse>(api_url + '/upload', getConfig)
    .then((response) => {
      const data = response.data as PresignedResponse;
      addFilesFormData(data);
      addFiles({ files: file, fileId: data.fileId, jobId: data.jobId, userId: data.userId });
    })
    .catch((error) => {
      toast.error(`Error uploading file: ${file.name}. Please try again.`);
      return error;
    });
};
