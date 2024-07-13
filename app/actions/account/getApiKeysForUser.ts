import { ApiKey } from '@/app/hooks/useAccountStore';

export default function getApiKeysForUser(): ApiKey[] {
  return [
    {
      key: '12365d78-d7cf-44e1-abdd-eb0eada2f604',
      type: 'GET_API_KEY',
      createdAt: '2022-01-01T00:00:00Z',
    },
    {
      key: '6a38fff6-a4f0-484a-811d-6f9f21ada3d1',
      type: 'GET_API_KEY',
      createdAt: '2022-01-02T00:00:00Z',
    },
  ];
}
