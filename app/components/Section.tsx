'use client';

import React from "react";
import Heading from "./Heading";

interface SectionProps {
  title: string;
  paragraphs: string[];
  center?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  paragraphs,
  center
}) => {
  return (
    <div className={`max-w-[850px] pt-10 ${center ? 'text-center' : 'text-start'}`}>
      <Heading title={title} center={center} />
      <div className="flex flex-col items-center gap-5">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="font-light text-neutral-500 mt-5 text-2xl">
            <p key={index}>{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Section;