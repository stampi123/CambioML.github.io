import PageHero from '../components/hero/PageHero';
import PricingCard from '../components/pricing/PricingCard';

const PlaygroundPage = () => {
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={`Pricing`} description={'Find the right plan for you.'} short />
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 mt-10 max-w-screen-xl">
        <PricingCard
          title="Starter"
          subtitle="For individuals or teams looking to try out the platform"
          price="$249*"
          period="month"
          features={['Auto-capture tables and transform to markdown', 'Monthly Pay as you go', 'No hidden fees']}
          additionalPrice="1,000 pages, then $0.25 per page"
          footer="*First month money back guarantee"
        />
        <PricingCard
          title="Pro"
          subtitle="For teams looking to automate time-draining tasks with advanced platform tools or APIs"
          price="$499"
          period="month"
          additionalPrice="1,000 pages, then $0.50 per page"
          features={[
            'All Starter features',
            'Quality audit for the first 1000 pages available',
            'Customized client onboarding',
            'Customized output available (e.g. customized JSON)',
          ]}
          outline
        />
        <PricingCard
          title="Enterprise"
          subtitle="For businesses looking to scale with the best data privacy and security features"
          price="contact-us"
          period="year"
          features={[
            'All Starter and Pro starter features',
            'Host on your own private servers',
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
