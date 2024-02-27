import { Icon } from '@phosphor-icons/react';

interface IconRowProps {
  icon: Icon;
  text: string;
}

const IconRow = ({ icon: RowIcon, text }: IconRowProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10  px-2">
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center text-neutral-700 rounded-2xl shadow-md bg-cambio-blue py-10 w-[200px] h-[175px]">
          <RowIcon size={70} />
        </div>
      </div>
      <div className="h-[150px] flex items-center text-center text-2xl text-neutral-700">{text}</div>
    </div>
  );
};

export default IconRow;
