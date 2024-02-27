'use client';

import Heading from './Heading';
import { Icon } from '@phosphor-icons/react';
import IconRow from './IconRow';

interface IconSectionProps {
  title: string;
  points: { icon: Icon; text: string }[];
  center?: boolean;
}

const IconSection = ({ title, points, center }: IconSectionProps) => {
  return (
    <div className={`w-full max-w-[850px] pt-10 ${center ? 'text-center' : 'text-start'}`}>
      <Heading title={title} center={center} />
      <div className="flex flex-col h-fit gap-10">
        {points.map((point, index) => (
          <IconRow key={index} icon={point.icon} text={point.text} />
        ))}
      </div>
    </div>
  );
};

export default IconSection;
