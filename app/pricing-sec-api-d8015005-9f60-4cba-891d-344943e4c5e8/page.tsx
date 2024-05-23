import PageHero from '../components/hero/PageHero';
import PricingCard from '../components/pricing/PricingCard';

const PlaygroundPage = () => {
  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={`Pricing`} description={'Find the right plan for you.'} short />
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 mt-10 max-w-screen-xl">
        <PricingCard
          title="Starter"
          subtitle="For startups with fewer than 5 employees, individual developers, and university researchers."
          price="$499*"
          period="month"
          features={[
            'Tickers: S&P 500',
            '10K/10Q Financials: Available in 30min**',
            '8K/6K Financials: Available in 30min',
          ]}
          footer="*First month money back guarantee"
          license="Commercial Use. Terms apply."
        />
        <PricingCard
          title="Business"
          subtitle="The license permits internal business use."
          price="$999"
          period="month"
          features={[
            'Tickers: S&P 500, Russell 3000',
            '8K/6K Financials: Available in 30min',
            '10K/10Q Financials : Coming Soon',
            '10K/10Q Segments and KPIs: Coming Soon',
            '8K/6K Segments and KPIs: Coming Soon',
            '20F/40F Financials: Coming Soon',
            'Earning call transcripts: Coming Soon',
          ]}
          outline
          license="Commercial Use. Terms apply."
        />
        <PricingCard
          title="Enterprise & Institutions"
          subtitle="For redistribution licenses, multiple API keys, priority support, or unlimited data. Please contact us."
          price="contact-us"
          period="year"
          features={[]}
          color
        />
      </div>
      <div className="h-[100px] p-8 rounded-xl w-full">
        <ul>
          <li>
            *Financials include standardized balance sheet, income statement, and cash flow statement, as well as the
            raw financial docs.
          </li>
          <li>**Available in 30 minutes once a statement is published on SEC.</li>
        </ul>
      </div>
    </div>
  );
};

export default PlaygroundPage;
