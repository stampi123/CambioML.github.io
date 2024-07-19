'use client';

import ProductCard from './components/ProductCard';
import Feature from './components/feature/Feature';
import Hero from './components/hero/Hero';
import { FaAws } from 'react-icons/fa';
import { SiMicrosoftazure, SiGooglecloud } from 'react-icons/si';
import UseCaseOverview from './components/home-page/UseCaseOverview';
import Customers from './components/home-page/Customers';
import Card from './components/Card';
import { FileMagnifyingGlass, LockKey, Lock, Table, Target, Robot } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Hero
        title="Accurate, Private and Configurable Document Retrieval LLM"
        subtitle="Transform your information assets into competitive advantage with the most state-of-the-art document retrieval AI"
        typingWords={['PDF format', 'image resolution', 'PPT layout']}
        typingStaticWords="Unmatched extraction accuracy on any"
        image="/images/hero.png"
        center
      />
      <div className="h-full w-full py-10">
        <Feature title="Extract key information with full confidence" center>
          <div className="h-[1000px] lg:h-[450px] grid grid-cols-1 lg:grid-cols-3 gap-10 py-10">
            <Card
              text="Extract 10x more hidden insights from tables, charts, indexes, headers and footers."
              center
              cardIcon={FileMagnifyingGlass}
            />
            <Card text="Redact confidential information during the retrieval as needed." center cardIcon={Lock} />
            <Card text="Output to JSON, CSV or Markdown. Ready for LLM as well as database." center cardIcon={Table} />
          </div>
        </Feature>
        <div className="w-full h-[200px] flex items-center justify-center">
          <a
            href="https://www.ycombinator.com/launches/KWQ-cambioml-enterprise-data-gold-mining"
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt="Launch YC: CambioML - Enterprise data gold mining"
              src="https://www.ycombinator.com/launches/KWQ-cambioml-enterprise-data-gold-mining/upvote_embed.svg"
              className="w-[400px]"
            />
          </a>
        </div>
        <Feature title="Open-source Libraries are Adopted by Researchers at" alternate center>
          <Customers />
        </Feature>
        <Feature title="Accurate, Automatic, and Secure" center>
          <div className="h-[1000px] lg:h-[450px] grid grid-cols-1 lg:grid-cols-3 gap-10 py-10">
            <Card
              text="Fully privacy preserved. Redact confidential information during the retrieval as needed."
              center
              cardIcon={LockKey}
            />
            <Card
              text="No hallucination. 90% less error rate than traditional OCR based model."
              center
              cardIcon={Target}
            />
            <Card text="No more manual data entry. Map to the schema as you need." center cardIcon={Robot} />
          </div>
        </Feature>
        <Feature title="Extract Insights from your Proprietary Data with Ease" alternate center>
          <UseCaseOverview />
        </Feature>
        <Feature title="Host your private LLMs anywhere in your control" description="" center>
          <div
            className="w-full min-w-[1200px] h-full
                            mt-10
                            grid
                            grid-cols-1
                            md:grid-cols-3
                            gap-8
                            "
          >
            <ProductCard
              title="Test Cambio API today"
              outline
              buttonText="Launch Playground"
              buttonHandler={() => router.push('playground')}
            >
              Extract and Map your files on our Playground.
            </ProductCard>
            <ProductCard title="Deploy on the Cloud">
              <FaAws size={80} />
              <SiMicrosoftazure size={50} />
              <SiGooglecloud size={70} />
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
