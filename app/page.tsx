import ProductCard from "./components/ProductCard";
import Feature from "./components/feature/Feature";
import Hero from "./components/hero/Hero";
import { FaAws } from "react-icons/fa";
import { SiMicrosoftazure } from "react-icons/si";



export default function Home() {
  return (
    <>
      <Hero
        title="Private LLMs: Your Secret Boost"
        descriptions={["Faster Decision Making", "Better Compliance", "More Secure"]}
        image="/images/hero.png"
      />
      <div className="h-full w-full py-10">
        <Feature title="Private domain-expert AI from any unstructured data" center>
          <div className="flex flex-col items-center justify-center border-solid border-2 border-cambio-blue rounded-xl w-full h-[500px]">
            TODO
          </div>
        </Feature>
        <Feature title="Host your private LLMs anywhere in your control" description="Fully SOC2 Compliant" center>
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
        <Feature title="Auto-evaluation and compliance on-demand" description="Fully SOC 2 Compliant" center>
          <div className="flex flex-col items-center justify-center border-solid border-2 border-cambio-blue  rounded-xl w-full h-[500px]">
            TODO
          </div>
        </Feature>
      </div>
    </>
  )
}