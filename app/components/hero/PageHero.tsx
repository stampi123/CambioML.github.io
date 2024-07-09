'use client';

import Button from '../Button';
import Container from '../Container';

interface PageHeroProps {
  title: string;
  description?: string;
  image?: string;
  button?: { label: string; link?: string; onClick?: () => void };
  short?: boolean;
}

const PageHero = ({ title, description, button, short }: PageHeroProps) => {
  return (
    <div className="relative text-white w-full">
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-l from-cambio-blue-2 to-cambio-blue-3 text-white w-full h-full">
        <div className="absolute inset-0 bg-[radial-gradient(#666_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>
      </div>
      <Container styles={`relative z-10 ${short ? 'h-[200px] mt-20' : 'h-[55vh] min-h-[650px]'} w-full`}>
        <div className="flex justify-center items-center h-full w-full">
          <div className="max-w-[800px] flex flex-col items-center justify-center gap-20 h-full">
            <div>
              <h1 className="text-6xl font-bold mb-8 text-center whitespace-pre-line">{title}</h1>
              {description && <p className="text-3xl text-center whitespace-pre-line">{description}</p>}
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
