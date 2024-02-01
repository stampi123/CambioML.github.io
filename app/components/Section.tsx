'use client';

import Heading from './Heading';

interface SectionProps {
  title: string;
  paragraphs: string[];
  center?: boolean;
}

const Section = ({ title, paragraphs, center }: SectionProps) => {
  return (
    <div className={`max-w-[850px] pt-10 ${center ? 'text-center' : 'text-start'}`}>
      <Heading title={title} center={center} />
      <div className="flex flex-col items-center gap-5">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="font-light text-neutral-600 mt-5 text-2xl">
            <p key={index}>{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
