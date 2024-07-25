import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface IParams {
  userId: string;
  token: string;
}

export default async function getApiKey({ userId, token }: IParams): Promise<ApiKey> {
  const params = {
    userId,
  };

  const apiKeyEndpoint = process.env.NEXT_PUBLIC_API_KEY_ENDPOINT || '';

  try {
    const response = await axios.post(`${apiKeyEndpoint}/makekey`, params, {
      headers: {
        'Content-Type': 'application/json',
        authorizationToken: token,
        apiKey: '-',
      },
    });

    if (response.status === 200) {
      return {
        key: response.data.apiKey,
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
