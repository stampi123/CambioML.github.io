import axios, { AxiosError, AxiosResponse } from 'axios';
import { QueryParams } from './apiInterface';

interface IParams {
  api_url: string;
  postParams: QueryParams;
  token: string;
  handleSuccess: (response: AxiosResponse, page?: number) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  page?: number;
}

const pollJobStatus = async ({
  api_url,
  token,
  postParams,
  handleSuccess,
  handleError,
  handleTimeout,
  page,
}: IParams) => {
  const jobStatusAPI: string = api_url + '/query';
  const timeoutDuration = 600000; // 10 minutes
  const pollInterval = 200; // 200 milliseconds
  const startTime = Date.now();
  const poll = async () => {
    if (Date.now() - startTime > timeoutDuration) {
      handleTimeout();
      return;
    }
    axios
      .post(jobStatusAPI, postParams, {
        headers: {
          'Content-Type': 'application/json',
          authorizationToken: token,
          apiKey: '-',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          handleSuccess(response, page);
          return;
        } else if (response.status === 202 || response.status === 403) {
          setTimeout(poll, pollInterval);
        } else {
          return;
        }
      })
      .catch((e: AxiosError) => {
        handleError(e);
        return;
      });
  };

  poll();
};

export default pollJobStatus;
