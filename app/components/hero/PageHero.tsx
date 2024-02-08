'use client';

import Button from '../Button';
import Container from '../Container';
import Image from 'next/image';

interface PageHeroProps {
  title: string;
  description?: string;
  image?: string;
  button?: { label: string; link?: string; onClick?: () => void };
}

const PageHero = ({ title, description, image, button }: PageHeroProps) => {
  return (
    <div
      className={`w-full h-full overflow-hidden relative ${!image && 'bg-gradient-to-tr from-cambio-blue from-30% via-white to-cambio-blue to-70%'}`}
    >
      <Container styles="h-[55vh] min-h-[550px]">
        {image && (
          <Image
            src={image}
            alt="PageHero"
            layout="fill"
            style={{
              objectFit: 'cover',
              zIndex: -1,
              backgroundPosition: 'center',
            }}
            quality={100}
          />
        )}
        <div className={`flex justify-center items-center h-full w-full`}>
          <div className="max-w-[800px] flex flex-col items-center justify-center gap-20 h-full">
            <div>
              <h1 className="text-6xl font-bold text-gray-900 mb-8 text-center whitespace-pre-line">{title}</h1>
              {description && <p className="text-3xl text-gray-600 text-center whitespace-pre-line">{description}</p>}
            </div>
            {button && (
              <div className="w-[300px]">
                {button.onClick ? (
                  <Button label={button.label} onClick={button.onClick} />
                ) : (
                  <a href={button.link} target="_blank" rel="noopener noreferrer">
                    <Button label={button.label} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PageHero;
