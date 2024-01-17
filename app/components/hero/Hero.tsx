'use client';

import Container from "../Container";
import Image from 'next/image';
import { useTypingEffect } from "@/app/hooks/useTypingEffect";
import { imgPrefix } from "@/app/hooks/useImgPrefix";

interface HeroProps {
    title: string;
    subtitle?: string;
    descriptions?: string[];
    center?: boolean;
    image?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, descriptions, center, image }) => {
    return (
        <div className={`w-full h-full overflow-hidden relative mt-[10px] ${!image && 'bg-cambio-blue'}`}>
            <Container styles="h-[85vh]">
                {image &&
                    <Image
                        src={imgPrefix + image}
                        alt="Hero"
                        fill
                        style={{
                            objectFit: 'cover',
                            zIndex: -1,
                            backgroundPosition: 'center',
                        }}
                        quality={100} />
                }
                <div className={`flex flex-col justify-center ${center && 'items-center'} h-full w-full`}>
                    <div className="max-w-[540px]">
                        {
                            descriptions &&
                            <p className={`mt-3 text-2xl text-gray-500 pb-5 ${center && 'text-center'}`}>
                                {useTypingEffect(descriptions, 100, 75)}
                                <span className="text-cambio-red">|</span>
                            </p>
                        }
                        <h1 className={`text-6xl font-bold text-gray-900 pb-20 ${center && 'text-center'}`}>{title}</h1>
                        {
                            subtitle &&
                            <p className={`mt-3 text-3xl text-gray-500 ${center && 'text-center'}`}>
                                {subtitle}
                            </p>
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
};

export default Hero;