'use client';

import Container from '../Container';
import Heading from '../Heading';

interface FeatureProps {
  title: string;
  description?: string;
  center?: boolean;
  children: React.ReactNode;
}

const Feature = ({ title, description, center, children }: FeatureProps) => {
  return (
    <Container styles="h-max">
      <div className="flex flex-col items-center gap-10 py-10 h-max w-full">
        <Heading title={title} subtitle={description} center={center} />
        <div className="flex flex-col items-center justify-center h-max w-full min-h-[500px] max-w-[1000px]">
          {children}
        </div>
      </div>
    </Container>
  );
};

export default Feature;
