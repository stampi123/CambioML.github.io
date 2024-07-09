'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import PageHero from '@/app/components/hero/PageHero';
import Container from '@/app/components/Container';

const CalendlyWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget w-full min-w-[320px] h-[900px]"
      data-url={process.env.NEXT_PUBLIC_CALENDLY_URL || ''}
    ></div>
  );
};

const BookDemoPage = () => {
  const DynamicCalendlyWidget = dynamic(() => Promise.resolve(CalendlyWidget), { ssr: false });

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center ">
      <PageHero title="🗓️ Book a Demo" description="Let's show you how you can maximize your data extraction" short />
      <Container styles="h-[50vh] min-h-[1000px] py-10 w-full">
        <DynamicCalendlyWidget />
      </Container>
    </div>
  );
};

export default BookDemoPage;
