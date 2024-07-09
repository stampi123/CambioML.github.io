'use client';

import Heading from './Heading';
import Button from './Button';
import { CaretRight } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  outline?: boolean;
  buttonText?: string;
  buttonHandler?: () => void;
}

const ProductCard = ({ title, subtitle, outline, children, buttonText, buttonHandler }: ProductCardProps) => {
  const router = useRouter();
  const bookDemo = () => {
    router.push('/book-demo');
  };
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className={`flex flex-col items-center justify-between rounded-xl p-10 h-[550px] shadow-md
        col-span-1 w-[500px] md:w-full ${outline ? 'border-solid border-2 border-neutral-100' : 'bg-cambio-blue-2'}
        `}
      >
        <div>
          <Heading title={title} subtitle={subtitle} center white={!outline} />
          <div
            className={`mt-5 text-center text-lg font-light flex flex-col items-center justify-center gap-5 text-neutral-500 ${!outline && 'text-white'}`}
          >
            {children}
          </div>
        </div>
        <div className={`w-full ${!outline && 'text-neutral-800'}`}>
          <Button
            label={buttonText || 'Book a Demo'}
            onClick={buttonHandler || bookDemo}
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
