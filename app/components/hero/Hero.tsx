'use client';

import Container from '../Container';
import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Button from '../Button';
import useDemoModal from '@/app/hooks/useDemoModal';

interface HeroProps {
  title: string;
  valueProps: string;
  subtitle?: string;
  center?: boolean;
  image?: string;
}

const Hero = ({ title, subtitle, valueProps, center, image }: HeroProps) => {
  const demoModal = useDemoModal();
  return (
    <div className={`w-full h-full overflow-hidden relative mt-[10px] ${!image && 'bg-cambio-blue'}`}>
      <Container styles="h-[80vh]">
        {image && (
          <Image
            src={imgPrefix + image}
            alt="Hero"
            fill
            style={{
              objectFit: 'cover',
              zIndex: -1,
              backgroundPosition: 'center',
              filter: 'blur(3px)',
            }}
            quality={100}
          />
        )}
        <div className={`flex flex-col justify-center ${center && 'items-center'} h-full w-full`}>
          <div className="max-w-[900px]">
            {subtitle && (
              <div className={`mt-3 text-3xl text-neutral-600 font-semibold ${center && 'text-center'}`}>
                {subtitle}
              </div>
            )}
            <h1 className={`text-6xl font-bold text-neutral-800 pt-4 pb-10 ${center && 'text-center'}`}>{title}</h1>
            {valueProps && (
              <div className={`mt-3 text-2xl text-neutral-600 ${center && 'text-center'} whitespace-pre-line`}>
                {valueProps}
              </div>
            )}
          </div>
          <div className="w-[300px] h-[175px] flex flex-col-reverse z-1">
            <Button
              label="Book a Demo"
              onClick={() => {
                demoModal.onOpen();
              }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
