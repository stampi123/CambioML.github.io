import { CaretDown, CaretUp, Icon } from '@phosphor-icons/react';
import React, { useState, useRef } from 'react';

export interface Option {
  value: string;
  label: string;
  callback?: () => void;
}

interface DropdownButtonProps {
  options: Option[];
  optionLabel?: string;
  disabled?: boolean;
  icon?: Icon;
}

const DropdownButton = ({ options, disabled = false, optionLabel, icon: Icon }: DropdownButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // useEffect(() => {
  //   if (selectedFileIndex !== null && files.length > 0 && files[selectedFileIndex].compareFile !== null) {
  //     const compareFile = files[selectedFileIndex].compareFile;
  //     if (compareFile === null) return;
  //     setSelectedOption({ value: '0', label: compareFile.name });
  //   }
  // }, [selectedFileIndex, files]);

  const handleOptionClick = (option: Option) => {
    option.callback && option.callback();
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full text-md ${disabled ? 'pointer-events-none opacity-50' : ''}`} ref={selectRef}>
      <div
        className="bg-cambio-gray rounded-xl cursor-pointer  text-neutral-100 w-full h-full flex justify-center items-center"
        onClick={toggleDropdown}
      >
        {Icon && <Icon size={24} />}
        <div className="p-2 mr-8 overflow-hidden">{optionLabel ? optionLabel : 'Select an option'}</div>
        {isOpen ? (
          <CaretUp size={24} className="absolute right-2 top-4" />
        ) : (
          <CaretDown size={24} className="absolute right-2 top-4" />
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
              className="p-2 cursor-pointer hover:bg-gray-100 overflow-hidden truncate text-center"
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

export default DropdownButton;
