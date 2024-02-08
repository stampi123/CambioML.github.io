'use client';

import Heading from './Heading';
import Paragraphs from './Paragraphs';

interface SectionProps {
  title: string;
  paragraphs: string[];
  center?: boolean;
}

const Section = ({ title, paragraphs, center }: SectionProps) => {
  return (
    <div className={`max-w-[850px] pt-10 ${center ? 'text-center' : 'text-start'}`}>
      <Heading title={title} center={center} />
      <Paragraphs paragraphs={paragraphs} center={center} />
    </div>
  );
};

export default Section;
