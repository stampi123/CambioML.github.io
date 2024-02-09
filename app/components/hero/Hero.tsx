'use client';

import Container from '../Container';
import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Button from '../Button';
import useDemoModal from '@/app/hooks/useDemoModal';
import { useTypingEffect } from '@/app/hooks/useTypingEffect';

interface HeroProps {
  title: string;
  subtitle?: string;
  typingWords: string[];
  center?: boolean;
  image?: string;
}

const Hero = ({ title, subtitle, typingWords, center, image }: HeroProps) => {
  const demoModal = useDemoModal();
  return (
    <div className={`w-full h-full overflow-hidden relative mix-blend-overlay ${!image && 'bg-cambio-blue'}`}>
      {image && (
        <>
          <Image
            src={imgPrefix + image}
            alt="Hero"
            fill
            style={{
              objectFit: 'cover',
              zIndex: -1,
              backgroundPosition: 'center',
              filter: 'blur(2px)',
              opacity: 0.5,
            }}
            quality={100}
          />
          <div className="absolute -z-10 bg-gradient-to-r from-cambio-blue from-10% via-white to-cambio-blue to-90% h-full w-full" />
        </>
      )}
      <Container styles="h-[60vh] min-h-[600px]">
        <div className={`flex flex-col justify-center ${center && 'items-center'} h-full w-full`}>
          <div className="max-w-[900px]">
            <p className={`mt-3 text-2xl text-gray-500 pb-5 ${center && 'text-center'}`}>
              Any {useTypingEffect(typingWords, 75, 50, 1000)}
              <span className="text-cambio-red">|</span>
            </p>
            <h1 className={`text-6xl font-bold text-neutral-800 pt-4 pb-5 ${center && 'text-center'}`}>{title}</h1>
            {subtitle && (
              <div className={`mt-3 text-3xl text-neutral-600 font-semibold ${center && 'text-center'}`}>
                {subtitle}
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
