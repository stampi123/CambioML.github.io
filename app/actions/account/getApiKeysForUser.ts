import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';

interface IParams {
  userId: string;
  token: string;
  apiURL: string;
}

export default async function getApiKeysForUser({ userId, token, apiURL }: IParams): Promise<ApiKey[]> {
  const params = {
    userId,
  };

  try {
    const response = await axios.get(`${apiURL}/listkeys`, {
      headers: {
        'Content-Type': 'application/json',
        authorizationToken: token,
        apiKey: '-',
      },
      params,
    });

    if (response.status === 200) {
      console.log(response.data);
      const apiKeys = response.data.apiKeys.map((thisKey: string) => ({
        key: thisKey,
      }));
      return apiKeys;
    } else {
      // const errorMessage = 'Failed to get API key';
      // toast.error(errorMessage);
      return [];
      // throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    // toast.error('Failed to get API key');
    // throw new Error('Failed to get API key');
    return [];
  }
}
