import { create } from 'zustand';

interface PricingContactModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePricingContactModal = create<PricingContactModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePricingContactModal;
