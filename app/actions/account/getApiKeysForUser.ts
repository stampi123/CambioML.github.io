import { ApiKey } from '@/app/hooks/useAccountStore';
import axios from 'axios';

interface IParams {
  clientId: string;
  token: string;
}

export default async function getApiKeysForUser({ clientId, token }: IParams): Promise<ApiKey[]> {
  const params = {
    userId: clientId,
  };
  try {
    const response = await axios.get('https://3ec4wj1s02.execute-api.us-west-2.amazonaws.com/v1/listkeys', {
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
