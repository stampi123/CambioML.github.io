import { create } from 'zustand';

interface KeySelectModalStore {
  isOpen: boolean;
  keyValue: { [key: string]: string } | null;
  inputKey: string;
  onOpen: () => void;
  onClose: () => void;
  setKeyValue: (keyValue: { [key: string]: string }) => void;
  setInputKey: (inputKey: string) => void;
}

const useKeySelectModal = create<KeySelectModalStore>((set) => ({
  isOpen: false,
  keyValue: null,
  inputKey: '',
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setKeyValue: (keyValue) => set({ keyValue }),
  setInputKey: (inputKey) => set({ inputKey }),
}));

export default useKeySelectModal;
