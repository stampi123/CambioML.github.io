import { create } from 'zustand';

interface ResultZoomModalStore {
  isOpen: boolean;
  content: React.ReactElement | (() => React.ReactElement) | null;
  page: number; // New page state
  setPage: (page: number) => void; // New function to set page
  onOpen: () => void;
  onClose: () => void;
  setContent: (content: React.ReactElement | (() => React.ReactElement)) => void;
}

const useResultZoomModal = create<ResultZoomModalStore>((set) => ({
  isOpen: false,
  content: null,
  page: 0, // Initialize page state
  setPage: (page) => set({ page }), // Implement setPage function
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setContent: (content) => set({ content }),
}));

export default useResultZoomModal;
