import ProductCard from './components/ProductCard';
import Feature from './components/feature/Feature';
import Hero from './components/hero/Hero';
import { FaAws } from 'react-icons/fa';
import { SiMicrosoftazure } from 'react-icons/si';
import FeatureImage from './components/feature/FeatureImage';
import UseCaseOverview from './components/home-page/UseCaseOverview';
import Customers from './components/home-page/Customers';

export default function Home() {
  return (
    <>
      <Hero
        title="Software for Enterprises to Understand Their Data"
        subtitle={`Reduce 90% time of data cleaning and enrichment
        Discover insights from 10x more data in multiple formats
        Fully own and control your proprietary AI agent`}
        descriptions={['PDF', 'HTML', 'Images', 'Markdown']}
        image="/images/hero.png"
      />
      <div className="h-full w-full py-10">
        <Feature title="Distill domain knowledge from your mixed unstructured data" center>
          <FeatureImage image="/images/graphics/cambioml-flow-graphic.png" alt="CambioML Flow Graphic" shadow />
        </Feature>
        <Feature title="Adopted by Researchers and Teams at " bgColor="bg-neutral-100" center>
          <Customers />
        </Feature>
        <Feature title="Domain-specific knowledge and insights from your own enterprise data" center>
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
