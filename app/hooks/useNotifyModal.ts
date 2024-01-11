import { create } from 'zustand';

interface NotifyModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useNotifyModal = create<NotifyModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true}),
  onClose: () => set({ isOpen: false}),
}));

export default useNotifyModal;