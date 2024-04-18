import axios, { AxiosError, AxiosResponse } from 'axios';

export interface GetParams {
  job_id: string;
  user_id: string;
  job_type: string;
  user_prompt?: string; // Optional property
}

interface Config {
  params: GetParams;
  headers?: { authorizationToken: string };
}

interface IParams {
  api_url: string;
  getParams: GetParams;
  handleSuccess: (response: AxiosResponse) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  token?: string;
}

const pollJobStatus = async ({ api_url, handleSuccess, handleError, handleTimeout, getParams, token }: IParams) => {
  const jobStatusAPI: string = api_url + '/sync';
  const getConfig: Config = {
    params: getParams,
  };

  if (token) {
    getConfig.headers = {
      authorizationToken: token,
    };
  }
  console.log('pollJobStatus getConfig', getConfig);

  const timeoutDuration = 600000; // 10 minutes
  const pollInterval = 200; // 200 milliseconds
  const startTime = Date.now();
  const poll = async () => {
    if (Date.now() - startTime > timeoutDuration) {
      handleTimeout();
      return;
    }
    axios
      .get(jobStatusAPI, getConfig)
      .then((response) => {
        if (response.status === 200) {
          handleSuccess(response);
          return;
        } else if (response.status === 202) {
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
