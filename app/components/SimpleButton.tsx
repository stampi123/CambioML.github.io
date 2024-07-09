'use client';

import { Icon } from '@phosphor-icons/react';

interface SimpleButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  small?: boolean;
  icon?: Icon;
  labelIcon?: Icon;
}

const SimpleButton = ({ label, onClick, disabled, small, icon: Icon, labelIcon: LabelIcon }: SimpleButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-xl
        bg-neutral-200
        hover:bg-cambio-blue-0
        hover:text-white
        transition
        w-full
        text-neutral-600
        ${small ? 'py-3' : 'py-4'}
        ${small ? 'text-lg' : 'text-3xl'}
        font-semibold
      `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )}
      <div className="flex items-center justify-center gap-2">
        <span>{label} </span>
        {LabelIcon && (
          <LabelIcon
            size={24}
            className="
          "
          />
        )}
      </div>
    </button>
  );
};

export default SimpleButton;
