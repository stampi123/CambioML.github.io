'use client';

import ProductCard from './components/ProductCard';
import Feature from './components/feature/Feature';
import Hero from './components/hero/Hero';
import { FaAws } from 'react-icons/fa';
import { SiMicrosoftazure } from 'react-icons/si';
import UseCaseOverview from './components/home-page/UseCaseOverview';
import Customers from './components/home-page/Customers';
import Card from './components/Card';
import { FileMagnifyingGlass, TrendDown, Gauge, Crosshair, Sparkle, LockKey } from '@phosphor-icons/react';

export default function Home() {
  return (
    <>
      <Hero
        title="ML Platform for Enterprise R&D"
        subtitle="Extract research insights from your unstructured data"
        typingWords={['Encrypted PDFs', 'Images and Markdowns', 'HTMLs or public URLs', 'papers and patents']}
        image="/images/hero.png"
        center
      />
      <div className="h-full w-full py-10">
        <Feature title="Distill domain knowledge from your mixed unstructured data" center>
          <div className="h-[1000px] lg:h-[450px] grid grid-cols-1 lg:grid-cols-3 gap-10 py-10">
            <Card text="Discover novel research insights from 10x more data" center cardIcon={FileMagnifyingGlass} />
            <Card text="Reduce time spent cleaning unstructured data by up to 90%" center cardIcon={TrendDown} />
            <Card text="Accelerate the discovery of revenue opportunities" center cardIcon={Gauge} />
          </div>
        </Feature>
        <Feature title="Open-source Libraries are Adopted by Researchers at" bgColor="bg-neutral-100" center>
          <Customers />
        </Feature>
        <Feature title="Accurate, Explainable, and Secure" center>
          <div className="h-[1000px] lg:h-[450px] grid grid-cols-1 lg:grid-cols-3 gap-10 py-10">
            <Card
              text="Accurately extract unstructured data from PDFs, HTMLs and Markdown"
              center
              cardIcon={Crosshair}
            />
            <Card text="Explain insights by domain-specific LLMs" center cardIcon={Sparkle} />
            <Card text="Fully own and control your proprietary data" center cardIcon={LockKey} />
          </div>
        </Feature>
        <Feature title="Extract domain-specific knowledge from your R&D data with ease" bgColor="bg-neutral-100" center>
          <UseCaseOverview />
        </Feature>
        <Feature title="Host your private LLMs anywhere in your control" description="" center>
          <div
            className="w-full h-full
                            mt-10
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-8
                            "
          >
            <ProductCard title="Deploy on the Cloud">
              <FaAws size={80} />
              <SiMicrosoftazure size={50} />
            </ProductCard>
            <ProductCard title="Deploy on your data center" outline>
              Host our services on your data center
            </ProductCard>
          </div>
        </Feature>
      </div>
    </>
  );
}
