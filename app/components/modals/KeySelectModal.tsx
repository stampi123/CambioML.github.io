'use client';

import useKeySelectModal from '@/app/hooks/useKeySelectModal';
import SmallModal from './SmallModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';

const KeySelectModal = () => {
  const KeySelectModal = useKeySelectModal();
  const { selectedFileIndex, files, updateFileAtIndex } = usePlaygroundStore();

  const handleKVClick = (key: string) => {
    if (selectedFileIndex !== null) {
      const curKeyMap = files[selectedFileIndex].keyMap;
      curKeyMap[KeySelectModal.inputKey] = key;
      updateFileAtIndex(selectedFileIndex, 'keyMap', curKeyMap);
      KeySelectModal.onClose();
    }
  };
  const bodyContent = (
    <div className="flex items-start justify-center w-full h-full md:h-[500px] overflow-y-auto p-0">
      <div className="h-fit w-full text-neutral-700 p-1 flex flex-col gap-2">
        {KeySelectModal.keyValue &&
          Object.keys(KeySelectModal.keyValue).map((key, i) => {
            const [tableTitle, thisKey] = key.split('-');

            return (
              <div
                key={i}
                className="cursor-pointer border-[1px] border-solid border-neutral-200 hover:bg-neutral-100 w-full p-4 rounded-lg grid grid-cols-3 gap-2"
                onClick={() => handleKVClick(key)}
              >
                <div className="flex gap-2">
                  <div className="font-semibold">Key:</div>
                  <div>{thisKey}</div>
                </div>
                <div className="flex gap-2">
                  <div className="font-semibold">Value:</div>
                  <div>{KeySelectModal.keyValue && KeySelectModal.keyValue[key]}</div>
                </div>
                <div className="flex gap-2">
                  <div className="font-semibold">Table:</div>
                  <div className="text-center">{tableTitle}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <SmallModal
      title={`Key Edit: ${KeySelectModal.inputKey}`}
      isOpen={KeySelectModal.isOpen}
      onClose={KeySelectModal.onClose}
      body={bodyContent}
    />
  );
};

export default KeySelectModal;
