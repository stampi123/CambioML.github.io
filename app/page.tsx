import Image from "next/image";
import ProductCard from "./components/ProductCard";
import Feature from "./components/feature/Feature";
import Hero from "./components/hero/Hero";
import { FaAws } from "react-icons/fa";
import { SiMicrosoftazure } from "react-icons/si";
import FeatureImage from "./components/feature/FeatureImage";
import FlowOverview from "./components/feature/FlowOverview";



export default function Home() {
  return (
    <>
      <Hero
        title="Custom-built AI Just For You"
        subtitle="ML scientists spending 80% of time cleaning messy data for AI model training. We make it 10x faster."
        descriptions={["Faster Decision Making", "Better Compliance", "More Secure"]}
        image="/images/hero.png"
      />
      <div className="h-full w-full py-10">
        <Feature title="Transform domain-specific data to your own private AI agent" center>
          <FlowOverview/>
        </Feature>
        <Feature title="Distill domain knowledge from any unstructured data" center>
          <FeatureImage image="/images/graphics/cambioml-flow-graphic.png" alt="CambioML Flow Graphic" shadow />
        </Feature>
        <Feature title="Host your private LLMs anywhere in your control" description="" center>
          <div className="w-full h-full
                            mt-10
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-8
                            ">
            <ProductCard title="Deploy on the Cloud" notify>
              <FaAws size={80} />
              <SiMicrosoftazure size={50} />
            </ProductCard>
            <ProductCard title="Deploy on your data center" notify outline>
              Host our services on your data center
            </ProductCard>
          </div>
        </Feature>
      </div>
    </>
  )
}