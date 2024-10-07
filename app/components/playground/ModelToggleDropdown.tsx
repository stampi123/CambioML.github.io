import { useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ModelType } from '@/app/types/PlaygroundTypes';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Example icon for the dropdown arrow

const ModelToggleDropdown = () => {
  const { modelType, updateModelType } = usePlaygroundStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionSelect = (option: ModelType) => {
    updateModelType(option);
    setIsOpen(false); // Close the dropdown after selection
  };

  const miniLabel = 'AP-base';
  const proLabel = 'AP-pro';
  const ultraLabel = 'AP-ultra';

  const getLabel = (type: ModelType) => {
    switch (type) {
      case ModelType.BASE:
        return miniLabel;
      case ModelType.PRO:
        return proLabel;
      case ModelType.ULTRA:
        return ultraLabel;
      default:
        return 'Select Model';
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div className="w-[124px]">
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-between w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-md font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {getLabel(modelType)}
          {isOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1">
            <button
              onClick={() => handleOptionSelect(ModelType.BASE)}
              className={`${
                modelType === ModelType.BASE ? 'bg-gray-100' : ''
              } block w-full text-left px-4 py-2 text-md text-gray-700 hover:bg-gray-100`}
              role="menuitem"
            >
              {miniLabel}
            </button>
            <button
              onClick={() => handleOptionSelect(ModelType.PRO)}
              className={`${
                modelType === ModelType.PRO ? 'bg-gray-100' : ''
              } block w-full text-left px-4 py-2 text-md text-gray-700 hover:bg-gray-100`}
              role="menuitem"
            >
              {proLabel}
            </button>
            {/* <button
              onClick={() => handleOptionSelect(ModelType.ULTRA)}
              className={`${
                modelType === ModelType.ULTRA ? 'bg-gray-100' : ''
              } block w-full text-left px-4 py-2 text-md text-gray-700 hover:bg-gray-100`}
              role="menuitem"
            >
              {ultraLabel}
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelToggleDropdown;
