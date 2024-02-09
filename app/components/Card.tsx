'use client';

import { Icon } from '@phosphor-icons/react';

interface CardProps {
  text: string;
  outline?: boolean;
  center?: boolean;
  cardIcon?: Icon;
}

const Card = ({ text, outline, center, cardIcon: CardIcon }: CardProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-start w-full h-full rounded-xl  p-10 shadow-md
    col-span-1 w-[500px] md:w-full max-w-[500px] ${outline ? 'border-solid border-2 border-neutral-100' : 'bg-cambio-blue'}`}
    >
      <div
        className={`flex flex-col items-center justify-start text-neutral-700 gap-10 pt-10 ${center ? 'text-center' : 'text-start'}
        `}
      >
        {CardIcon && <CardIcon size={40} />}
        <div className="text-2xl whitespace-pre-line">{text}</div>
      </div>
    </div>
  );
};

export default Card;
