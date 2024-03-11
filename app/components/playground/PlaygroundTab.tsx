import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { Icon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

interface PlaygroundTabProps {
  label: string;
  icon?: Icon;
}

const unselectedStyle = 'text-neutral-500 hover:bg-neutral-100';
const selectedStyle = 'text-neutral-800 bg-cambio-blue';

const PlaygroundTab = ({ label, icon: Icon }: PlaygroundTabProps) => {
  const { selectedFileIndex, files, updateSelectedFile, loggedIn } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const handleClick = () => {
    if (loggedIn) {
      updateSelectedFile('activeTab', label);
    }
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      setSelectedFile(files[selectedFileIndex]);
    }
  }, [selectedFileIndex, files]);
  return (
    <div
      className={`text-xl flex items-center justify-center gap-2 cursor-pointer rounded-t-xl font-semibold ${selectedFile?.activeTab === label ? selectedStyle : unselectedStyle}`}
      onClick={handleClick}
    >
      {label}
      {Icon && <Icon size={24} />}
    </div>
  );
};

export default PlaygroundTab;
