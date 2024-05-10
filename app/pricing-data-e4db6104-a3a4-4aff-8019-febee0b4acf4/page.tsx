import PageHero from '../components/hero/PageHero';
import PricingCard from '../components/pricing/PricingCard';

const PlaygroundPage = () => {
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={`Pricing`} description={'Find the right plan for you.'} short />
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 mt-10 max-w-screen-xl">
        <PricingCard
          title="Personal & Startups"
          subtitle="For startups with fewer than 5 employees, individual developers, and university researchers."
          price="$299*"
          period="month billed annually"
          features={[
            'Real time financial statements: 5 years',
            'Real-time Segments & KPI Data: 5 years',
            'Financial PDF to JSON: 1000 pages',
            'Response Time: Within 2 business days',
          ]}
          additionalPrice="$399 per month billed monthly"
          footer="*First month money back guarantee"
        />
        <PricingCard
          title="Business"
          subtitle="The license permits internal business use."
          price="$499"
          period="month billed annually"
          additionalPrice="$599 per month billed monthly"
          features={[
            'Real time financial statements: 20 years',
            'Real-time Segments & KPI Data: 10+ years',
            'Financial PDF to JSON: 3000 pages',
            'Response Time: Within 1 business day',
            'Onboarding & Premium Support',
          ]}
          outline
        />
        <PricingCard
          title="Enterprise & Institutions"
          subtitle="For redistribution licenses, multiple API keys, priority support, or unlimited data. Please contact us."
          price="contact-us"
          period="year"
          features={[
            'Real time financial statements: Contact us',
            'Real-time Segments & KPI Data: Contact us',
            'Financial PDF to JSON: Contact us',
            'Response Time: Contact us',
            'Onboarding & Premium Support',
          ]}
          color
        />
      </div>
    </div>
  );
};

export default PlaygroundPage;
