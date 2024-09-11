import useUserProfile from '@/app/hooks/useUserProfile';
import PageHero from '../hero/PageHero';
import PricingCard from './PricingCard';

const ProductDisplay = () => {
  const { profile, error, loading } = useUserProfile();

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={`AnyParser Products`} description={'Find the right plan for you.'} short />
      <div className="h-full w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 mt-10 max-w-screen-xl">
        <PricingCard
          userId={profile?.sub || ''}
          title="Starter"
          subtitle="For startups with fewer than 5 employees, individual developers, and university researchers."
          price="$499*"
          period="month"
          features={[
            'Tickers: S&P 500',
            '10K/10Q Financials**',
            '10K/10Q Segments and KPIs',
            '20F/40F Financials: Coming Soon',
            '20F/40F Segments and KPIs: Coming Soon',
          ]}
          license="Commercial Use. Terms apply."
          priceLookupKey="starter_annual"
          loggedIn={!loading && !error && !!profile}
          loading={loading}
        />
        <PricingCard
          userId={profile?.sub || ''}
          title="Business"
          subtitle="The license permits internal business use."
          price="$999*"
          period="month"
          features={[
            'Tickers: S&P 500, Russell 3000',
            '10K/10Q Financials',
            '10K/10Q Segments and KPIs',
            '20F/40F Financials: Coming Soon',
          ]}
          outline
          license="Commercial Use. Terms apply."
          priceLookupKey="pro_annual"
          loggedIn={!loading && !error && !!profile}
          loading={loading}
        />
        <PricingCard
          userId={profile?.sub || ''}
          title="Enterprise & Institutions"
          subtitle="For redistribution licenses, multiple API keys, priority support, or unlimited data. Please contact us."
          price="contact-us"
          period="year"
          features={['All Starter and Business features', 'Contact us for custom features']}
          color
          loggedIn={!loading && !error && !!profile}
          loading={loading}
        />
      </div>
      <div className="mt-10 p-8 rounded-xl bg-neutral-100 w-[500px] lg:w-full lg:max-w-screen-xl h-fit">
        <ul>
          <li>*First month money back guarantee</li>
          <li>
            **Financials include standardized balance sheet, income statement, and cash flow statement, as well as the
            raw financial docs.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDisplay;
