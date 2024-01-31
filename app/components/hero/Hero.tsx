'use client';

import Container from '../Container';
import Image from 'next/image';
import { useTypingEffect } from '@/app/hooks/useTypingEffect';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Button from '../Button';
import useDemoModal from '@/app/hooks/useDemoModal';

interface HeroProps {
  title: string;
  descriptions: string[];
  subtitle?: string;
  center?: boolean;
  image?: string;
}

const Hero = ({ title, subtitle, descriptions, center, image }: HeroProps) => {
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
            }}
            quality={100}
          />
        )}
        <div className={`flex flex-col justify-center ${center && 'items-center'} h-full w-full`}>
          <div className="max-w-[800px]">
            <p className={`mt-3 text-2xl text-gray-500 pb-5 ${center && 'text-center'}`}>
              Any {useTypingEffect(descriptions, 100, 75)}
              <span className="text-cambio-red">|</span>
            </p>
            <h1 className={`text-6xl font-bold text-gray-900 pb-20 ${center && 'text-center'}`}>{title}</h1>
            {subtitle && (
              <div className={`mt-3 text-3xl text-gray-500 ${center && 'text-center'} whitespace-pre-line`}>
                {subtitle}
              </div>
            )}
          </div>
          <div className="w-[300px] h-[175px] flex flex-col-reverse z-10">
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
