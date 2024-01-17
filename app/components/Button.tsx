'use client';
import { Icon } from "@phosphor-icons/react";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  labelIcon?: Icon;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  labelIcon: LabelIcon
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-xl
        hover:bg-cambio-red
        hover:text-white
        transition
        w-full
        ${outline ? 'bg-inherit' : 'bg-cambio-blue'}
        ${outline ? 'border-cambio-blue' : 'border-neutral-800'}
        ${outline ? 'text-black' : 'text-neutral-800'}
        ${small ? 'py-1' : 'py-3'}
        ${small ? 'text-sm' : 'text-md'}
        ${small ? 'border-[1px]' : 'border-2'}
      `}
    >
      {/* {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )} */}
      <div className="flex items-center justify-center">
        <span>{label} </span>{LabelIcon && <LabelIcon
          size={24}
          className="
          "
        />}
      </div>
    </button>
  )
};

export default Button;