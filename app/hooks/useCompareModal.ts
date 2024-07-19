import { create } from 'zustand';

interface CompareModalStore {
  isOpen: boolean;
  file: File | null;
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
  setFile: (file: File) => void; // New function to set page
  onOpen: () => void;
  onClose: () => void;
}

const useCompareModal = create<CompareModalStore>((set) => ({
  isOpen: false,
  file: null,
  content: null,
  setContent: (content) => set({ content }), // Implement setPage function
  setFile: (file) => set({ file }), // Implement setPage function
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCompareModal;
