'use client';

import PageHero from '../components/hero/PageHero';

const PricingPage = () => {
  return (
    <div className="x pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={`API Pricing`} description={'Find the right plan for you.'} short />
      <div className="container mx-auto px-4 py-16">
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
        <stripe-pricing-table
          pricing-table-id="prctbl_1PfVgN01JxjgXdPmaczVMjAk"
          publishable-key="pk_test_51P9ES801JxjgXdPmTbwZIkDuGJ5lsnkBXRMzi1CO7Oxi0L7DDoc6rTRJEr0frYOf59l5XQOOc0uoPhSEKjNNOCyh00N2HNX7FG"
        ></stripe-pricing-table>
      </div>

      <div className="h-[100px] p-8 rounded-xl w-screen-xl items-center justify-center">
        <ul>
          <li>*No hidden fees; 30 days money back guaranteed</li>
        </ul>
        <ul>
          <li>
            **1 credit can extract 1 page of PDF or image, or make a single API call to map data to your customized
            schemas.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PricingPage;
