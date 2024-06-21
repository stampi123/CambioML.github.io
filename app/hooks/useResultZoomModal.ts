import { create } from 'zustand';

interface ResultZoomModalStore {
  isOpen: boolean;
  content: React.ReactElement | null;
  onOpen: () => void;
  onClose: () => void;
  setContent: (content: React.ReactElement) => void;
}

const useResultZoomModal = create<ResultZoomModalStore>((set) => ({
  isOpen: false,
  content: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setContent: (content) => set({ content }),
}));

export default useResultZoomModal;
