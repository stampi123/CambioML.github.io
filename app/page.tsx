import ProductCard from './components/ProductCard';
import Feature from './components/feature/Feature';
import Hero from './components/hero/Hero';
import { FaAws } from 'react-icons/fa';
import { SiMicrosoftazure } from 'react-icons/si';
import FeatureImage from './components/feature/FeatureImage';
import UseCaseOverview from './components/home-page/UseCaseOverview';
import Customers from './components/home-page/Customers';
import Paragraphs from './components/Paragraphs';

export default function Home() {
  return (
    <>
      <Hero
        title="ML Platform for Enterprise R&D"
        subtitle="Extract knowledge from your unstructured data"
        valueProps={`Discover novel research insights from 10x more data
        Reduce time spent cleaning unstructured data by up to 90%
        Accelerate the discovery of revenue opportunities`}
        image="/images/hero.png"
        center
      />
      <div className="h-full w-full py-10">
        <Feature title="Distill domain knowledge from your mixed unstructured data" center>
          <FeatureImage image="/images/graphics/cambioml-flow-graphic.png" alt="CambioML Flow Graphic" shadow />
        </Feature>
        <Feature title="Open-source Libraries are Adopted by Researchers at" bgColor="bg-neutral-100" center>
          <Customers />
        </Feature>
        <Feature title="Accurate, Explainable, and Secure" center>
          <div className="h-[400px] flex items-center justify-center py-10">
            <Paragraphs
              paragraphs={[
                '🎯 Accurately extract unstructured data from PDFs, HTMLs and Markdown',
                '✨ Explain insights by domain-specific LLMs',
                '🔒 Fully own and control your proprietary data',
              ]}
              between
              large
            />
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
