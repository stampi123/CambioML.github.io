'use client';

import PageHero from '@/app/components/hero/PageHero';
import Section from '@/app/components/Section';
import useDemoModal from '@/app/hooks/useDemoModal';
import Feature from '@/app/components/feature/Feature';
import DemoFeature from '@/app/components/feature/DemoFeature';

const RDSolutionsPage = () => {
  const demoModal = useDemoModal();
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero
        title={`Access the Knowns and
        Unlock the Unknowns in R&D`}
        description={`Reduce time spent on data cleaning by up to 90%
        Keep up-to-date with the state-of-the-art research
        Discover the unknowns in R&D with ease`}
        button={{ label: 'Book a Demo', onClick: demoModal.onOpen }}
      />
      <div className="flex flex-col gap-10 items-center justify-center py-20">
        <Feature title="Access unknown insights from multi-source data" center>
          <DemoFeature
            imageTitle="Your Corporate Laptop"
            image="/images/graphics/cambio-flow-rd.png"
            alt="Cambio Flow R&D"
            text={`• Reduce time spent on data cleaning by up to 90%
            • Discover the unknowns in R&D with ease
            • Fully own and control your proprietary AI agent`}
          />
        </Feature>
        <Feature title="Write your research report to prove state-of-the-art" center>
          <DemoFeature
            demo="/images/pykoi/pykoi-rag-chatbot-modify.gif"
            alt="Cambio Flow Portfolio"
            text={`• Back up your research novelty with real data
            • Compare your research with the SOTA at ease
            • Fully own and control your proprietary AI agent`}
          />
        </Feature>
      </div>
    </div>
  );
};

export default RDSolutionsPage;
