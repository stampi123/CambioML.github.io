import { QAResult, QueryResult } from '../actions/apiInterface';

export enum ExtractState {
  NO_DATA,
  READY,
  UPLOADING,
  EXTRACTING,
  DONE_EXTRACTING,
}

export enum TransformState {
  READY,
  TRANSFORMING,
  DONE_TRANSFORMING,
}

export enum CompareState {
  READY,
  COMPARING,
  DONE_COMPARING,
}

export enum ExtractTab {
  FILE_EXTRACT,
  TABLE_EXTRACT,
  INITIAL_STATE,
}

export enum MapTab {
  TABLE_SELECT,
  MAP_SCHEMA,
}

export interface MapSchemaResult {
  keyMap: { [key: string]: string };
  extractedKeys: { [key: string]: string };
}

export interface ExtractedMDTable {
  title: string;
  table: string;
  tableCsv: string[][];
  tableData: { [key: string]: string };
}

export interface PlaygroundFile {
  file: File | string;
  extractResult: QueryResult;
  qaResult: QAResult | null;
  tableExtractResult: [''];
  tableMdExtractResult: ExtractedMDTable[];
  keyMap: { [key: string]: string };
  extractedKV: { [key: string]: string };
  tableMapIndices: Set<number>;
  jobId: string;
  userId: string;
  fileId: string;
  s3_file_source: {
    s3_bucket: string;
    source_type: string;
    s3_prefix: string;
  };
  activeTab: string;
  extractState: ExtractState;
  tableExtractState: ExtractState;
  tableMdExtractState: ExtractState;
  extractTab: ExtractTab;
  mapTab: MapTab;
  qaState: TransformState;
  summarizeState: TransformState;
  compareState: CompareState;
  compareFile: File | null;
  compareResult: string;
}

export interface TransformResult {
  file_source: S3FileSource;
  file_metadata: { original_file_name: string };
  results: {
    output: OutputItem[];
  }[][];
  status: string;
}

export interface OutputItem {
  error: string;
  response: {
    context: string;
    question: string;
    answer: string;
  }[];
}

interface S3FileSource {
  s3_bucket: string;
  source_type: string;
  s3_prefix: string;
}

export const PlaygroundTabs = {
  EXTRACT: 'Extract',
  MAP: 'Map',
};
