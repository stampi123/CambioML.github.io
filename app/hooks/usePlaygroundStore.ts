import { create } from 'zustand';
import {
  PresignedResponse,
  PlaygroundFile,
  PlaygroundTabs,
  ExtractState,
  TransformState,
} from '../types/PlaygroundTypes';

interface PlaygroundStore {
  selectedFileIndex: number | null;
  files: PlaygroundFile[];
  filesToUpload: File[];
  filesFormData: PresignedResponse[];
  token: string;
  clientId: string;
  loggedIn: boolean;
  setSelectedFileIndex: (index: number) => void;
  setFiles: (files: File[]) => void;
  setFilesToUpload: (files: File[]) => void;
  setToken: (token: string) => void;
  setClientId: (clientId: string) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  addFiles: (files: File | File[]) => void;
  addHTMLFile: (file: string) => void;
  addFilesFormData: (newResponse: PresignedResponse) => void;
  updateSelectedFile: (property: string, value: string) => void;
  updateFileAtIndex: (index: number | null, property: string, value: string | ExtractState | TransformState) => void;
}

const initialFileState = {
  extractResult: '',
  transformResult: {},
  jobId: '',
  userId: '',
  s3_file_source: {},
  activeTab: PlaygroundTabs.EXTRACT,
  extractState: ExtractState.READY,
  transformState: TransformState.NO_DATA,
};

const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  selectedFileIndex: null,
  files: [],
  filesToUpload: [],
  filesFormData: [],
  token: 'token',
  clientId: 'client_id',
  loggedIn: false,
  activeTab: '',
  setSelectedFileIndex: (index) => {
    set({ selectedFileIndex: index });
  },
  setFiles: (files) => {
    const playgroundFiles = files.map((file) => ({
      file: file,
      ...initialFileState,
    })) as PlaygroundFile[];
    set({ files: playgroundFiles });
  },
  addFiles: (files) => {
    set((state) => {
      const filesToAdd = Array.isArray(files) ? files : [files];
      const playgroundFilesToAdd = filesToAdd.map((file) => ({
        file: file,
        ...initialFileState,
      })) as PlaygroundFile[];

      const uniqueFiles = playgroundFilesToAdd.filter((playgroundFile) =>
        state.files.every(
          (existingFile) =>
            existingFile.file instanceof File &&
            playgroundFile.file instanceof File &&
            existingFile.file.name !== playgroundFile.file.name
        )
      );

      return {
        files: [...state.files, ...uniqueFiles],
      };
    });
  },
  addHTMLFile: (file) => {
    set((state) => {
      const fileToAdd = {
        file: file,
        ...initialFileState,
      } as PlaygroundFile;

      for (file in state.files) {
        if (typeof file === 'string' && fileToAdd.file === file) {
          [...state.files];
        }
      }

      return {
        files: [...state.files, fileToAdd],
      };
    });
  },
  setFilesToUpload: (files) => set({ filesToUpload: files }),
  setToken: (token) => set({ token: token }),
  setClientId: (clientId) => set({ clientId: clientId }),
  updateSelectedFile: (property, value) => {
    set((state) => {
      if (state.selectedFileIndex !== null) {
        const selectedFile = { ...state.files[state.selectedFileIndex], [property]: value };
        const files = [...state.files];
        files[state.selectedFileIndex] = selectedFile;
        return { files };
      }
      return state;
    });
  },
  updateFileAtIndex: (index, property, value) => {
    if (index !== null) {
      set((state) => {
        const selectedFile = { ...state.files[index], [property]: value };
        const files = [...state.files];
        files[index] = selectedFile;
        return { files };
      });
    }
  },
  setLoggedIn: (loggedIn) => {
    set({ loggedIn: loggedIn });
  },
  addFilesFormData: (formData) => {
    set((state: PlaygroundStore) => ({
      ...state,
      filesFormData: [...state.filesFormData, formData],
    }));
  },
}));

export default usePlaygroundStore;
