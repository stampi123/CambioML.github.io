import React, { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import 'tailwindcss/tailwind.css';

interface EditableTextProps {
  text: string;
}

const EditableText: React.FC<EditableTextProps> = ({ text }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(text);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    console.log('done editing');
  };

  return (
    <div className="relative group w-full">
      {isEditing ? (
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleBlur}
          autoFocus
          className="border rounded px-2 py-1"
        />
      ) : (
        <div
          onClick={handleTextClick}
          className="w-full flex justify-between items-center cursor-pointer rounded-lg border border-transparent hover:border-neutral-100 p-1"
        >
          <span>{text}</span>
          <FiEdit3 className="ml-2 text-gray-500 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        </div>
      )}
    </div>
  );
};

export default EditableText;
