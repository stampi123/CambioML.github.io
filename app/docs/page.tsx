'use client';
import PageHero from '@/app/components/hero/PageHero';
import Container from '@/app/components/Container';
import Button from '../components/Button';
import Heading from '../components/Heading';

const DocsPage = () => {
  return (
    <>
      <PageHero title="📑 Documentation" />
      <Container styles="h-max min-h-[50vh] py-20 max-w-[850px]">
        <div className="py-10">
          <Heading title="🎏 Pykoi" subtitle="Get started with pykoi" center />
          <div className="pt-5">
            <a href="/docs/pykoi/index.html" target="_blank">
              <Button label="Read the Docs" />
            </a>
          </div>
        </div>
        <div className="py-10">
          <Heading title="🌊 Uniflow" subtitle="Get started with uniflow" center />
          <div className="pt-5">
            <a href="/docs/uniflow/index.html" target="_blank">
              <Button label="Read the Docs" />
            </a>
          </div>
        </div>
      </Container>
    </>
  );
};

export default DocsPage;
