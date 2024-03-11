import { create } from 'zustand';

interface PlaygroundFeedbackModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePlaygroundFeedbackModal = create<PlaygroundFeedbackModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePlaygroundFeedbackModal;
