import { create } from 'zustand';

interface PreviewModalStore {
  isOpen: boolean;
  file: File | null;
  setFile: (file: File) => void; // New function to set page
  onOpen: () => void;
  onClose: () => void;
}

const usePreviewModal = create<PreviewModalStore>((set) => ({
  isOpen: false,
  file: null,
  setFile: (file) => set({ file }), // Implement setPage function
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewModal;
