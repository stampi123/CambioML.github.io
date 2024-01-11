'use client';

import React from "react";
import Heading from "./Heading";

interface SectionProps {
  title: string;
  description: string;
  center?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  center
}) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <Heading title={title} center={center}/>
      <div className="font-light text-neutral-500 mt-5 text-2xl">
        {description}
      </div>
    </div>
  )
};

export default Section;