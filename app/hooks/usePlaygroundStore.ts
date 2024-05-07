import { create } from 'zustand';
import {
  PlaygroundFile,
  PlaygroundTabs,
  ExtractState,
  TransformState,
  CompareState,
  ExtractTab,
} from '../types/PlaygroundTypes';
import { PresignedResponse } from '../actions/apiInterface';

export interface AddFileParams {
  files: File | File[];
  fileId: string;
  jobId: string;
  userId: string;
}

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
  addFiles: ({ files, fileId, jobId, userId }: AddFileParams) => void;
  addHTMLFile: (file: string) => void;
  addFilesFormData: (newResponse: PresignedResponse) => void;
  updateSelectedFile: (property: string, value: string) => void;
  updateFileAtIndex: (
    index: number | null,
    property: string,
    value: string | ExtractState | TransformState | CompareState | File | string[] | ExtractTab
  ) => void;
}

const initialFileState = {
  extractResult: [''],
  qaResult: null,
  tableExtractResult: [''],
  s3_file_source: { s3_bucket: '', source_type: '', s3_prefix: '' },
  activeTab: PlaygroundTabs.EXTRACT,
  extractState: ExtractState.READY,
  extractTab: ExtractTab.INITIAL_STATE,
  qaState: TransformState.READY,
  summarizeState: TransformState.READY,
  tableExtractState: ExtractState.READY,
  compareState: CompareState.READY,
  compareFile: null,
  compareResult: '',
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
  addFiles: ({ files, fileId, jobId, userId }: AddFileParams) => {
    set((state) => {
      const filesToAdd = Array.isArray(files) ? files : [files];
      const playgroundFilesToAdd = filesToAdd.map((file) => ({
        file: file,
        fileId,
        jobId,
        userId,
        ...initialFileState,
      })) as PlaygroundFile[];

      const uniqueFiles = playgroundFilesToAdd.filter((playgroundFile) =>
        state.files.every(
          (existingFile) =>
            typeof existingFile.file === 'string' ||
            (playgroundFile.file instanceof File && existingFile.file.name !== playgroundFile.file.name)
        )
      );
      if (uniqueFiles.length > 0) {
        set({ selectedFileIndex: state.files.length });
      }

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

      for (const thisFile of state.files) {
        if (typeof thisFile.file === 'string' && thisFile.file === file) {
          return {
            files: [...state.files],
          };
        }
      }

      set({ selectedFileIndex: state.files.length });

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
