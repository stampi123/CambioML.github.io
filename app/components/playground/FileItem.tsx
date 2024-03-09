import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { useEffect, useState } from 'react';

interface FileItemProps {
  pgFile: PlaygroundFile;
  index: number;
}

const FileItem = ({ pgFile, index }: FileItemProps) => {
  const { selectedFileIndex, setSelectedFileIndex } = usePlaygroundStore();
  const [filename, setFilename] = useState<string>('');

  useEffect(() => {
    if (pgFile.file instanceof File) {
      setFilename(pgFile.file.name);
    } else {
      setFilename(pgFile.file);
    }
  }, [pgFile.file, setFilename]);

  const handleClick = () => {
    setSelectedFileIndex(index);
  };

  return (
    <div
      className={`
                    w-full
                    h-[50px]
                    flex
                    flex-col
                    justify-center
                    cursor-pointer
                    px-4
                    rounded-md
                    ${index === selectedFileIndex ? 'bg-cambio-blue' : 'hover:bg-neutral-200'}
                    relative
                    group
                    `}
      onClick={handleClick}
    >
      <div className="truncate">{filename}</div>
    </div>
  );
};

export default FileItem;
