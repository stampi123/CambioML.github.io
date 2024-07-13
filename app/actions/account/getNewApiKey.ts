import { ApiKey } from '@/app/hooks/useAccountStore';
import { v4 as uuidv4 } from 'uuid';

export default function getApiKey(): ApiKey {
  return {
    key: uuidv4(),
    type: 'GET_API_KEY',
    createdAt: new Date().toISOString(),
  };
}
