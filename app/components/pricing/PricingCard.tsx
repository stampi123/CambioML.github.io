'use client';

import usePricingContactModal from '@/app/hooks/usePricingContactModal';
import { Check } from '@phosphor-icons/react';
import React, { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import PortalButton from './PortalButton';

const descriptionStyle = 'text-md font-light text-neutral-600 text-center min-h-[50px]';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  subtitle: string;
  features: string[];
  userId?: string;
  subscriptionId?: string;
  loading?: boolean;
  footer?: string;
  additionalPrice?: string;
  outline?: boolean;
  color?: boolean;
  license?: string;
  outlineColor?: string;
  priceLookupKey?: string;
  loggedIn?: boolean;
}

const PricingCard = ({
  title,
  subtitle,
  price,
  period,
  additionalPrice,
  features,
  outline,
  license,
  loading,
  color,
  footer,
  outlineColor,
  priceLookupKey,
  loggedIn,
  userId,
  subscriptionId,
}: PricingCardProps) => {
  const contactModal = usePricingContactModal();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget); // Collect form data
    const lookupKey = formData.get('lookup_key'); // Get the lookup_key from the form
    const domainUrl =
      process.env.NEXT_PUBLIC_STRIPE_RETURN_URL ||
      'https://www.cambioml.com/products-fdce3eb9-aa2b-4abf-8842-4bde6dc987c4';

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRIPE_SESSION_URL}payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, lookupKey, domainUrl }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // Redirect the user to the Stripe Checkout page
      window.location.href = result.url;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className={`grid grid-rows-2 rounded-xl h-[600px] shadow-md col-span-1 w-[500px] lg:w-full ${
          (color || outline) && 'border-none'
        } hover:shadow-lg transition duration-300 ease-in-out`}
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200 animate-pulse row-span-2 rounded-xl"></div>
        ) : (
          <>
            <div
              className={`p-6 w-full ${color && 'bg-cambio-blue'} border-t-8 ${
                outline && `border-solid ${outlineColor || 'border-sky-200'}`
              } ${color && 'border-solid border-sky-800 rounded-b-xl'} rounded-t-xl`}
            >
              <div className="text-xl font-semibold text-neutral-800 text-center pb-4">{title.toLocaleUpperCase()}</div>
              <div className={descriptionStyle}>{subtitle}</div>
              <div className="mt-5 text-center font-light flex flex-col items-center gap-5 text-neutral-500">
                <div className="flex justify-center items-end gap-2">
                  {price === 'contact-us' ? (
                    <button
                      className="text-lg min-w-[200px] text-white bg-sky-800 p-4 rounded-lg cursor-pointer hover:bg-sky-900 hover:text-neutral-100"
                      onClick={contactModal.onOpen}
                    >
                      Contact us
                    </button>
                  ) : (
                    <>
                      <div className="text-6xl font-semibold text-neutral-800">{price}</div>
                      <div className="text-lg font-semibold text-neutral-800">{`per ${period}`}</div>
                    </>
                  )}
                </div>
                {additionalPrice && <div className={descriptionStyle}>{additionalPrice}</div>}
                {license && <div className={descriptionStyle}>{license}</div>}
              </div>
            </div>
            <div className="w-full flex flex-col justify-between px-4">
              <div className={`${!color && 'border-t-2'} flex flex-col gap-1 justify-start items-start w-full py-4`}>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-neutral-600">
                    <Check size={16} weight="bold" className="shrink-0 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
              <div className="w-full flex items-center justify-center p-4">
                {!loggedIn ? (
                  <LoginButton />
                ) : (
                  priceLookupKey &&
                  (subscriptionId ? (
                    <PortalButton />
                  ) : (
                    <form id="stripe-form" onSubmit={handleSubmit} className="w-full flex items-center justify-center">
                      <input type="hidden" name="lookup_key" value={priceLookupKey} />
                      <button
                        type="submit"
                        className={`text-lg min-w-[200px] text-white bg-sky-800 p-4 rounded-lg cursor-pointer hover:bg-sky-900 hover:text-neutral-100 ${
                          isLoading ? 'opacity-40' : ''
                        }`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'Get Started'}
                      </button>
                    </form>
                  ))
                )}
              </div>
              {footer && <div className={`${descriptionStyle} italic`}>{footer}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
