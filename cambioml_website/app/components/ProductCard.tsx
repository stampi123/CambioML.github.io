'use client';

import Heading from "./Heading";
import Button from "./Button";
import { CaretRight } from "@phosphor-icons/react";

interface ProductCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    notify?: boolean;
    outline?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, subtitle, notify, outline, children }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className={`flex flex-col items-center justify-between rounded-xl  p-10 h-[600px]
        col-span-1 w-[500px] md:w-full ${outline ? 'border-solid border-2 border-cambio-blue' : 'bg-cambio-blue'}
        `}>
                <div>
                    <Heading title={title} subtitle={subtitle} center />
                    <div className="mt-5 text-center text-lg font-light flex flex-col items-center gap-5 text-neutral-500">
                        {children}
                    </div>
                </div>
                <div className="w-full">
                    <Button label="Notify Me" onClick={() => {console.log("notify click")}} outline={outline}
                    labelIcon={CaretRight}
                    />
                </div>
            </div>
        </div>
    )
};

export default ProductCard;