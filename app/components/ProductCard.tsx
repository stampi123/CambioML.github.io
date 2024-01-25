'use client';

import Heading from './Heading';
import Button from './Button';
import { CaretRight } from '@phosphor-icons/react';
import useDemoModal from '../hooks/useDemoModal';

interface ProductCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  outline?: boolean;
}

const ProductCard = ({ title, subtitle, outline, children }: ProductCardProps) => {
  const demoModal = useDemoModal();
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className={`flex flex-col items-center justify-between rounded-xl  p-10 h-[600px] shadow-md
        col-span-1 w-[500px] md:w-full ${outline ? 'border-solid border-2 border-neutral-100' : 'bg-cambio-blue'}
        `}
      >
        <div>
          <Heading title={title} subtitle={subtitle} center />
          <div className="mt-5 text-center text-lg font-light flex flex-col items-center gap-5 text-neutral-500">
            {children}
          </div>
        </div>
        <div className="w-full">
          <Button
            label="Book a Demo"
            onClick={() => {
              demoModal.onOpen();
            }}
            outline={outline}
            labelIcon={CaretRight}
            small
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
