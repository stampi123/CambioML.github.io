'use client';

import Container from "../Container";
import Image from 'next/image';

interface PageHeroProps {
    title: string;
    description?: string;
    image?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, description, image }) => {
    return (
        <div className={`w-full h-full overflow-hidden relative ${!image && 'bg-gradient-to-tr from-cambio-blue from-30% via-white to-cambio-blue to-70%'}`}>
            <Container styles="h-[575px]">
                {image &&
                    <Image
                        src={image}
                        alt="PageHero"
                        layout="fill"
                        style={{
                            objectFit: 'cover',
                            zIndex: -1,
                            backgroundPosition: 'center',
                        }}
                        quality={100} />
                }
                <div className={`flex flex-col justify-center items-center h-full w-full`}>
                    <div className="max-w-[800px]">
                        <h1 className="text-6xl font-bold text-gray-900 mb-8 text-center">{title}</h1>
                        {
                            description &&
                            <p className="text-3xl text-gray-600 text-center">{description}</p>
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
};

export default PageHero;