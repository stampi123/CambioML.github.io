'use client';

import PageHero from '@/app/components/hero/PageHero';
import Container from '../../components/Container';
import Button from '@/app/components/Button';
import { GithubLogo } from '@phosphor-icons/react';
import Section from '@/app/components/Section';

const AnyparserPage = () => {
  return (
    <>
      <PageHero
        title="📑 AnyParser"
        description="API to accurately extract your unstructured data into structured format"
        short
      />
      <Container styles="h-max min-h-[80vh] py-20 max-w-[850px]">
        <div className="flex flex-col gap-20">
          <Section
            title="AnyParser accurately extracts data from your files"
            paragraphs={[
              'Are you an ML professional grappling with the challenge of extracting high-quality data from confidential and unstructured data such as PDFs and PPTs? AnyParser can extract text, numbers and symbols from PDF, images, quickly and accurately.',
              'Get started with AnyParser in as little as 10 lines of code!',
            ]}
            center
          />
          <Button
            label="Check out the Github"
            onClick={() => window.open('https://github.com/CambioML/any-parser/tree/main', '_blank')}
            labelIcon={GithubLogo}
          />
        </div>
      </Container>
    </>
  );
};

export default AnyparserPage;
