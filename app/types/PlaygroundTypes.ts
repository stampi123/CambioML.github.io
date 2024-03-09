export interface PresignedResponse {
  presignedUrl: {
    fields: Record<string, string>;
    url: string;
  };
  jobId: string;
  userId: string;
}

export enum ExtractState {
  NO_DATA,
  READY,
  UPLOADING,
  EXTRACTING,
  DONE_EXTRACTING,
}

export enum TransformState {
  NO_DATA,
  READY,
  TRANSFORMING,
  DONE_TRANSFORMING,
}

export interface PlaygroundFile {
  file: File | string;
  extractResult: string;
  transformResult: TransformResult;
  jobId: string;
  userId: string;
  s3_file_source: {
    s3_bucket: string;
    source_type: string;
    s3_prefix: string;
  };
  activeTab: string;
  extractState: ExtractState;
  transformState: TransformState;
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
  EXTRACT: '1. Extract',
  TRANSFORM: '2. Transform',
};
