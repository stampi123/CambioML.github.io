import axios from 'axios';
import { PresignedResponse } from '../types/PlaygroundTypes';
import toast from 'react-hot-toast';

interface IParams {
  file: File;
  token: string;
  clientId: string;
  jobType: string;
}

export const uploadFile = async ({ file, token, clientId, jobType }: IParams) => {
  const file_name = file.name;
  const GetPresignedS3UrlAPI = `${process.env.NEXT_PUBLIC_PLAYGROUND_API_URL}/upload`;
  const config = {
    params: {
      token: token,
      client_id: clientId,
      file_name: file_name,
      job_type: jobType,
    },
  };
  return await axios
    .get<PresignedResponse>(GetPresignedS3UrlAPI, config)
    .then((response) => {
      const data = response.data as PresignedResponse;
      return data;
    })
    .catch((error) => {
      toast.error(`Error uploading file: ${file.name}. Please try again.`);
      return error;
    });
};
