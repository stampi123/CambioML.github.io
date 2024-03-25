import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import React, { useState, useRef, useEffect } from 'react';

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  optionLabel?: string;
  callback?: (option: Option) => void;
  disabled?: boolean;
}

const Select = ({ options, disabled = false, callback, optionLabel }: SelectProps) => {
  const { files, selectedFileIndex } = usePlaygroundStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (selectedFileIndex !== null && files.length > 0 && files[selectedFileIndex].compareFile) {
      const compareFile = files[selectedFileIndex].compareFile;
      setSelectedOption({ value: '0', label: compareFile.name });
    }
  }, [selectedFileIndex, files]);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    if (callback) {
      callback(option);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${disabled ? 'pointer-events-none opacity-50' : ''}`} ref={selectRef}>
      <div className="bg-white border border-gray-300 rounded-md cursor-pointer w-full" onClick={toggleDropdown}>
        <div className="p-2 mr-8 overflow-hidden">
          {selectedOption ? selectedOption.label : optionLabel ? optionLabel : 'Select an option'}
        </div>
        {isOpen ? (
          <CaretUp size={24} className="absolute right-2 top-2" />
        ) : (
          <CaretDown size={24} className="absolute right-2 top-2" />
        )}
      </div>
      {isOpen && !disabled && (
        <div
          className={`absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[200px] overflow-y-auto`}
          style={{ top: selectRef.current ? selectRef.current.clientHeight + 2 : 'auto' }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="p-2 cursor-pointer hover:bg-gray-100 overflow-hidden truncate"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
