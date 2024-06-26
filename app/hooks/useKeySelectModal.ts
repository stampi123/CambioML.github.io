import { create } from 'zustand';
import { ExtractedMDTable } from '../types/PlaygroundTypes';

interface KeySelectModalStore {
  isOpen: boolean;
  tableData: ExtractedMDTable[] | null;
  inputKey: string;
  onOpen: () => void;
  onClose: () => void;
  setTableData: (tableData: ExtractedMDTable[]) => void;
  setInputKey: (inputKey: string) => void;
}

const useKeySelectModal = create<KeySelectModalStore>((set) => ({
  isOpen: false,
  tableData: null,
  inputKey: '',
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setTableData: (tableData) => set({ tableData }),
  setInputKey: (inputKey) => set({ inputKey }),
}));

export default useKeySelectModal;
