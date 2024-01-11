'use client';

import React from "react";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  subtitle,
  center
}) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <div className="text-4xl font-semibold">
        {title}
      </div>
      <div className="font-light text-neutral-500 mt-5 text-2xl">
        {subtitle}
      </div>
    </div>
  )
};

export default Heading;