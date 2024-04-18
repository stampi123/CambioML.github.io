import axios from 'axios';
import { PresignedResponse } from '../types/PlaygroundTypes';
import toast from 'react-hot-toast';
import config from '../components/playground/config';

interface IParams {
  api_url: string;
  file: File | undefined;
  token: string;
  clientId: string;
  jobType: string;
  addFilesFormData: (data: PresignedResponse) => void;
  addFiles: (file: File) => void;
}

interface ConfigParams {
  token: string;
  client_id: string;
  file_name: string;
  job_type: string;
}

interface Config {
  params: ConfigParams;
  headers?: { authorizationToken: string };
}

export const uploadFile = async ({ api_url, file, token, clientId, jobType, addFiles, addFilesFormData }: IParams) => {
  if (!file) {
    toast.error('No file selected');
    return;
  }
  const file_name = file.name;
  const getConfig: Config = {
    params: {
      token: token,
      client_id: clientId,
      file_name: file_name,
      job_type: jobType,
    },
    ...(config.AUTH0_ENABLED && { headers: { authorizationToken: token } }),
  };

  return await axios
    .get<PresignedResponse>(api_url + '/upload', getConfig)
    .then((response) => {
      const data = response.data as PresignedResponse;
      console.log('data', data);
      addFilesFormData(data);
      addFiles(file);
    })
    .catch((error) => {
      toast.error(`Error uploading file: ${file.name}. Please try again.`);
      return error;
    });
};
