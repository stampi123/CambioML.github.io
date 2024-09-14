'use client';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import Container from '../Container';
import Heading from '../Heading';
import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';

const Hero = () => {
  const router = useRouter();
  return (
    <div className="h-fit w-full pt-20">
      <Container styles="relative z-10 h-fit min-h-[650px] py-10 lg:py-20">
        <div className="w-full h-fit grid gap-10 grid-cols-1 lg:grid-cols-2 lg:min-h-[700px]">
          <div className="w-full h-[500px] py-4 lg:h-full">
            <div className="relative w-full h-full">
              <Image
                src={`${imgPrefix}/images/homepage/hero-image.png`}
                alt="Image"
                fill
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                className="rounded-2xl"
              />
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center px-10">
            <div className="py-2">
              <a
                href="https://www.producthunt.com/posts/anyparser?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-anyparser"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=471331&theme=light&period=weekly&topic_id=94"
                  alt="AnyParser - Accurate&#0044;&#0032;private&#0032;and&#0032;configurable&#0032;document&#0032;retrieval&#0032;LLM | Product Hunt"
                  style={{ width: '250px', height: '54px' }}
                  width="250"
                  height="54"
                />
              </a>
            </div>
            <div className="w-full h-fit relative">
              <div className="absolute -top-20 -right-4 mt-2 mr-2 w-36 h-24">
                <Image
                  src={`${imgPrefix}/images/homepage/upperright-highlight.png`} // Replace with the path to your image
                  alt="Badge"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <Heading title="AnyParser: Vision LLM for Document Parsing" center />
            </div>
            <div className="text-lg text-center py-2">
              80% of OCR users are tired of maintaining glue code. Free up your time with our hands-free document LLM,
              offering unmatched accuracy and complete privacy.
            </div>
            <div className="text-lg text-center py-2">
              Parsing PDFs, PPTs, Word, and images with configurable options such as removing private identity info,
              extract table and charts, keeping footnotes and headers, and much more!
            </div>
            <div className="w-full pt-8 pb-2 flex items-center justify-center gap-4">
              <Button label="Try on our website!" onClick={() => router.push('/sandbox')} />
              <Button label="Get API Access" onClick={() => router.push('/account')} outline />
            </div>
            <div className="w-full py-1 flex items-center justify-center">No credit card required</div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
