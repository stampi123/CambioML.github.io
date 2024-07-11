import { create } from 'zustand';

export interface User {
  email: string;
  id: string;
  name: string;
}

export interface ApiKey {
  key: string;
  type: string;
}

interface AccountStore {
  user: User | null;
  apiKeys: ApiKey[];
  setUser: (user: User) => void;
  setApiKeys: (apiKeys: ApiKey[]) => void;
  addApiKey: (apiKey: ApiKey) => void;
}

const useAccountStore = create<AccountStore>((set) => ({
  user: null,
  apiKeys: [],
  setUser: (user) => set({ user }),
  setApiKeys: (apiKeys) => set({ apiKeys }),
  addApiKey: (apiKey) => set((state) => ({ apiKeys: [...state.apiKeys, apiKey] })),
}));

export default useAccountStore;
