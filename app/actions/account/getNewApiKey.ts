import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface IParams {
  clientId: string;
  token: string;
}

export default async function getApiKey({ clientId, token }: IParams): Promise<ApiKey> {
  const params = {
    user_id: clientId,
  };

  try {
    const response = await axios.post('https://3ec4wj1s02.execute-api.us-west-2.amazonaws.com/v1/makekey', params, {
      headers: {
        'Content-Type': 'application/json',
        authorizationToken: token,
        apiKey: '-',
      },
    });

    if (response.status === 200) {
      console.log(response.data);
      return {
        key: response.data.key,
        type: 'GET_API_KEY',
        createdAt: new Date().toISOString(),
      };
    } else {
      const errorMessage = 'Failed to get API key';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to get API key');
    throw new Error('Failed to get API key');
  }
}
