'use client';

import Container from '../Container';
import Button from '../Button';
import { useTypingEffect } from '@/app/hooks/useTypingEffect';
import { useRouter } from 'next/navigation';

interface HeroProps {
  title: string;
  subtitle?: string;
  typingWords: string[];
  typingStaticWords: string;
  center?: boolean;
  image?: string;
}

const Hero = ({ title, subtitle, typingWords, typingStaticWords, center }: HeroProps) => {
  const router = useRouter();

  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-l from-cambio-blue-2 to-cambio-blue-3 text-white">
        <div className="absolute h-full w-full bg-[radial-gradient(#666_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>
      </div>
      <Container styles="relative z-10 h-[60vh] min-h-[600px]">
        <div className={`flex flex-col justify-center ${center && 'items-center'} h-full w-full`}>
          <div className="max-w-[900px]">
            <p className={`mt-3 text-2xl text-white pb-5 ${center && 'text-center'}`}>
              {typingStaticWords} {useTypingEffect(typingWords, 75, 50, 1000)}
              <span className="text-cambio-blue-0">|</span>
            </p>
            <h1 className={`text-6xl font-bold text-white pt-4 pb-5 ${center && 'text-center'}`}>{title}</h1>
            {subtitle && (
              <div className={`mt-3 text-3xl text-white font-semibold ${center && 'text-center'}`}>{subtitle}</div>
            )}
          </div>
          <div className="w-[700px] h-[175px] flex flex-col-reverse">
            <div className="w-full h-[75px] flex gap-8">
              <Button
                label="Book a Demo"
                onClick={() => {
                  router.push('/book-demo');
                }}
              />
              <Button
                label="Test our Playground"
                onClick={() => {
                  router.push('/playground-3a284dca-393d-4d28-8a7a-bf202d475442');
                }}
                outline
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
