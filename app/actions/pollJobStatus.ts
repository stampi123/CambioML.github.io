import axios, { AxiosError, AxiosResponse } from 'axios';

interface IParams {
  getParams: { [key: string]: string };
  handleSuccess: (response: AxiosResponse) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
}

const pollJobStatus = async ({ handleSuccess, handleError, handleTimeout, getParams }: IParams) => {
  const api_url = process.env.NEXT_PUBLIC_PLAYGROUND_API_URL;
  const jobStatusAPI: string = api_url + '/sync';
  // let paramString = '';
  // for (const param in getParams) {
  //   paramString += `&${param}=${getParams[param]}`;
  // }
  // paramString = paramString.substring(1);
  // jobStatusAPI += `?${paramString}`;
  const config = {
    params: getParams,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const timeoutDuration = 600000; // 10 minutes
  const pollInterval = 200; // 200 milliseconds
  const startTime = Date.now();
  const poll = async () => {
    if (Date.now() - startTime > timeoutDuration) {
      handleTimeout();
      return;
    }
    axios
      .get(jobStatusAPI, config)
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
