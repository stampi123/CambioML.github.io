'use client';

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  white?: boolean;
}

const Heading = ({ title, subtitle, center, white }: HeadingProps) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <div className={`text-4xl ${white ? 'text-white' : 'text-neutral-800'} font-semibold whitespace-pre-line`}>
        {title}
      </div>
      <div className={`font-light ${white ? 'text-white' : 'text-neutral-500'} mt-5 text-2xl`}>{subtitle}</div>
    </div>
  );
};

export default Heading;
