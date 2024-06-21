import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { PlaygroundFile } from '@/app/types/PlaygroundTypes';
import { Check, FileMagnifyingGlass } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

interface TableSelectItemProps {
  tableName: string;
  tableIndex: number;
  tablePreviewIndex: number;
  setTablePreviewIndex: (tableIndex: number) => void;
}

const TableSelectItem = ({ tableName, tableIndex, tablePreviewIndex, setTablePreviewIndex }: TableSelectItemProps) => {
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();
  const [selectedFile, setSelectedFile] = useState<PlaygroundFile>();
  const [tableSelected, setTableSelected] = useState(true);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0) {
      const thisFile = files[selectedFileIndex];
      setSelectedFile(thisFile);
    }
  }, [selectedFileIndex, files, updateFileAtIndex]);

  const handleCheckClick = () => {
    if (tableSelected) {
      selectedFile?.tableMapIndices.delete(tableIndex);
    } else {
      selectedFile?.tableMapIndices.add(tableIndex);
    }
    setRenderTrigger((prev) => prev + 1); // Force re-render
  };

  useEffect(() => {
    if (selectedFile) {
      setTableSelected(selectedFile?.tableMapIndices.has(tableIndex));
    }
  }, [selectedFile, tableIndex, renderTrigger]);

  return (
    <div
      className={`h-[60px] w-full flex justify-between items-center p-2 gap-2 rounded-lg ${tableSelected ? 'bg-cambio-blue' : 'bg-neutral-100'}`}
    >
      <div className="h-full flex justify-center items-center gap-2">
        <div
          onClick={handleCheckClick}
          className="h-fit w-fit bg-white border-[1px] border-neutral-100 rounded-md flex justify-center align-center cursor-pointer gap-2"
        >
          {<Check size={20} className={tableSelected ? 'text-green-400' : 'text-white'} />}
        </div>
        {tableName}
      </div>
      <div
        onClick={() => setTablePreviewIndex(tableIndex)}
        className={`h-fit w-[40px] p-2 bg-white rounded-md flex justify-center align-center cursor-pointer gap-2 ${tablePreviewIndex === tableIndex ? 'text-neutral-800 font-semibold border-[1px] border-neutral-100 border-neutral-400' : 'text-neutral-300'}`}
      >
        <FileMagnifyingGlass size={20} />
      </div>
    </div>
  );
};

export default TableSelectItem;
