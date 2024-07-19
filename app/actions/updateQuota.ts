import axios, { AxiosError } from 'axios';

interface IParams {
  api_url: string;
  userId: string;
  token: string;
  setTotalQuota: (remaining: number) => void;
  setRemainingQuota: (total: number) => void;
  handleError: (error: AxiosError) => void;
}

const updateQuota = async ({ api_url, token, userId, setRemainingQuota, setTotalQuota, handleError }: IParams) => {
  const jobStatusAPI: string = api_url + '/query';
  const postParams = {
    userId,
    queryType: 'user_quota',
    jobId: 'jobId',
  };

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
        console.log('Quota response:', response.data);
        setRemainingQuota(response.data.remainingPage);
        setTotalQuota(response.data.totalPage);
      } else {
        throw new AxiosError('Failed to get quota');
      }
    })
    .catch((e: AxiosError) => {
      handleError(e);
      return;
    });
};

export default updateQuota;
