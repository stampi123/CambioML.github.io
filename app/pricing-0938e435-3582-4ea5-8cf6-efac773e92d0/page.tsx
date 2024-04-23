import PageHero from '../components/hero/PageHero';
import PricingCard from '../components/pricing/PricingCard';

const PlaygroundPage = () => {
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={`Pricing`} description={'Find the right plan for you.'} short />
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 mt-10 max-w-[1200px]">
        <PricingCard
          title="Starter"
          subtitle="For individuals or teams looking to try out the platform"
          price="$499"
          period="month"
          features={['Auto-capture tables and transform to markdown', 'Monthly Pay as you go', 'No hidden fees']}
          additionalPrice="2,000 pages, then $0.24 per page"
        />
        <PricingCard
          title="Pro"
          subtitle="For teams looking to automate time-draining tasks with advanced platform tools or APIs"
          price="$1299"
          period="month"
          additionalPrice="10,000 pages, then $0.12 per page"
          features={[
            'All Starter features',
            'Customization services available (e.g. annotation, quality audit)',
            'Customized client onboarding',
          ]}
          outline
        />
        <PricingCard
          title="Enterprise"
          subtitle="For businesses looking to scale with the best data privacy and security features"
          price="$99k"
          period="year"
          features={[
            'All Starter and Pro starter features',
            'Dedicated Account Manager',
            'Custom Integrations and API Responses',
            'Personalized 1-1 team training',
          ]}
          color
        />
      </div>
    </div>
  );
};

export default PlaygroundPage;
