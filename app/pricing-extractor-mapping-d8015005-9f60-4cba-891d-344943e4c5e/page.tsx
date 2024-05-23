import PageHero from '../components/hero/PageHero';
import PricingCard from '../components/pricing/PricingCard';

const PricingPage = () => {
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={`Pricing`} description={'Find the right plan for you.'} short />
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 mt-10 max-w-screen-xl">
        <PricingCard
          title="Starter"
          subtitle="For startups with fewer than 5 employees, individual developers, and university researchers."
          price="$499*"
          period="year, billed annually"
          features={[
            'Includes 10k pages per year, then $0.05 per page',
            'Auto-capture tables and transform to Markdown, CSV or JSON',
          ]}
          outline
          outlineColor="border-neutral-400"
        />
        <PricingCard
          title="Pro"
          subtitle="The license permits internal business use."
          price="$4K*"
          period="year, billed annually"
          features={[
            'All Starter features',
            'Includes 100k pages per year, then $0.04 per page',
            'Mapping to your customized schemas',
          ]}
          outline
          license="Commercial Use. Terms apply."
        />
        <PricingCard
          title="Silver"
          subtitle="The license permits internal business use."
          price="$15K*"
          period="year, billed annually"
          features={[
            'All Pro features',
            'Includes 500k pages per year, then $0.03 per page',
            'Customized client onboarding',
          ]}
          outline
          license="Commercial Use. Terms apply."
          outlineColor="border-[ecebff]"
        />
        <PricingCard
          title="Gold"
          subtitle="The license permits internal business use."
          price="$25K*"
          period="year, billed annually"
          features={[
            'All Silver Features',
            'Includes 1 millions pages per year, then $0.025 per page',
            'Customization services available (e.g. Annotation, quality audit)',
          ]}
          outline
          license="Commercial Use. Terms apply."
          outlineColor="border-amber-300"
        />
        <PricingCard
          title="Enterprise"
          subtitle="The license permits internal business use."
          price="contact-us"
          period="year"
          features={[
            'All features from Gold',
            'Custom model training',
            'Custom Integrations and API Responses',
            'Personalized 1-1 team training',
          ]}
          color
        />
      </div>
      <div className="h-[100px] p-8 rounded-xl w-screen-xl items-center justify-center">
        <ul>
          <li>*No hidden fees; 30 days money back guaranteed</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingPage;
