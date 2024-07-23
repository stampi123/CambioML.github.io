import { useEffect, useState } from 'react';
import MarkdownExtractContainer from './MarkdownExtractContainer';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';

const ExtractContainer = () => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);

  return <div className="h-full w-full pt-4">{selectedFile?.file instanceof File && <MarkdownExtractContainer />}</div>;
};

export default ExtractContainer;
