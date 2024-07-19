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
        className={`flex flex-col items-center justify-between rounded-xl p-10 h-[550px] shadow-md hover:scale-[1.01] hover:shadow-lg transition-transform duration-300 scol-span-1 w-[500px] md:w-full ${outline ? 'border-solid border-2 border-neutral-100' : 'bg-cambio-blue'}
        `}
      >
        <div>
          <Heading title={title} subtitle={subtitle} center />
          <div
            className={`mt-5 text-center text-2xl font-light flex flex-col items-center justify-center gap-5 text-neutral-500 `}
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
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
