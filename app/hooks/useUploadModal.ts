import { create } from 'zustand';

export enum UploadModalState {
  LOGIN,
  ADD_FILES,
  UPLOADING,
  UPLOADED,
}

interface UploadModalStore {
  isOpen: boolean;
  image: string;
  uploadModalState: UploadModalState;
  onOpen: () => void;
  onClose: () => void;
  setImage: (image: string) => void;
  setUploadModalState: (uploadModalState: UploadModalState) => void;
}

export const useUploadModal = create<UploadModalStore>((set) => ({
  isOpen: false,
  image: '',
  uploadModalState: UploadModalState.LOGIN,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setImage: (image) => set({ image }),
  setUploadModalState: (uploadModalState) => set({ uploadModalState }),
}));
