'use client';

import Button from "../Button";
import Container from "../Container";
import Image from 'next/image';

interface PageHeroProps {
    title: string;
    description?: string;
    image?: string;
    button?: { label: string, onClick: () => void };
}

const PageHero: React.FC<PageHeroProps> = ({ title, description, image, button }) => {
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
                <div className={`flex justify-center items-center h-full w-full`}>
                    <div className="max-w-[800px] flex flex-col items-center justify-center gap-40 h-full">
                        <div>

                            <h1 className="text-6xl font-bold text-gray-900 mb-8 text-center">{title}</h1>
                            {
                                description &&
                                <p className="text-3xl text-gray-600 text-center">{description}</p>
                            }
                        </div>
                        {
                            button &&
                            <div className="w-full">
                                <Button label={button.label} onClick={button.onClick} />
                            </div>
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
};

export default PageHero;