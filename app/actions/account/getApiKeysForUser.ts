import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';

interface IParams {
  userId: string;
  token: string;
}

export default async function getApiKeysForUser({ userId, token }: IParams): Promise<ApiKey[]> {
  const params = {
    userId,
  };
  const apiKeyEndpoint = process.env.NEXT_PUBLIC_API_KEY_ENDPOINT || '';
  try {
    const response = await axios.get(`${apiKeyEndpoint}/listkeys`, {
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
