import { Envelope } from '@phosphor-icons/react';
import React from 'react';
import Button from '../Button';

const textStyles = 'text-2xl font-semibold text-neutral-500 w-[500px] text-center';

const QuotaLimitPage = () => {
  const handleContactClick = () => {
    window.location.href = 'mailto:info@cambioml.com';
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className={textStyles}>Extract Page Limit Reached.</div>
      <div className={textStyles}>Please contact us to get more page quota.</div>
      <div className="w-[300px]">
        <Button label="info@cambioml.com" onClick={handleContactClick} small labelIcon={Envelope} />
      </div>
    </div>
  );
};

export default QuotaLimitPage;
