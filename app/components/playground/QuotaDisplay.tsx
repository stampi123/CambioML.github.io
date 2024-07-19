import React, { useState } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { ArrowsClockwise } from '@phosphor-icons/react';
import { useProductionContext } from './ProductionContext';
import updateQuota from '@/app/actions/updateQuota';

const QUOTA_YELLOW_THRESHOLD = 50;
const QUOTA_ORANGE_THRESHOLD = 25;
const QUOTA_RED_THRESHOLD = 15;

const QuotaDisplay = () => {
  const { totalQuota, remainingQuota, userId, token, setTotalQuota, setRemainingQuota } = usePlaygroundStore();
  const { apiURL } = useProductionContext();
  const [isLoading, setIsLoading] = useState(false);

  const quotaPercent = (remainingQuota / totalQuota) * 100;

  const handleRefresh = async () => {
    setIsLoading(true);
    await updateQuota({ api_url: apiURL, userId, token, setTotalQuota, setRemainingQuota, handleError: () => {} });
    setIsLoading(false);
  };

  const getBarColor = (quotaPercent: number) => {
    if (quotaPercent > QUOTA_YELLOW_THRESHOLD) return 'bg-green-500';
    if (quotaPercent > QUOTA_ORANGE_THRESHOLD) return 'bg-yellow-500';
    if (quotaPercent > QUOTA_RED_THRESHOLD) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full flex flex-col items-center pt-2">
      <div className="w-full flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">Quota</span>
        <div
          className="flex items-center text-neutral-600 justify-center bg-white rounded-md w-[35px] h-[35px] hover:bg-neutral-100 hover:text-neutral-800 hover:border-2 shrink-0 cursor-pointer"
          onClick={handleRefresh}
        >
          <ArrowsClockwise size={20} />
        </div>
      </div>
      {totalQuota === 0 || isLoading ? (
        <>
          <div className={`w-full bg-neutral-300 rounded-full h-2.5 animate-pulse`}> &nbsp;</div>
          <span className="text-xs mt-1">{`--/-- pages`}</span>
        </>
      ) : (
        <>
          <div
            className={`w-full ${remainingQuota === 0 ? 'bg-red-300' : 'bg-neutral-300'} rounded-full h-2.5 flex justify-end`}
          >
            <div
              className={`${getBarColor(quotaPercent)} ${isLoading && 'animate-pulse'} h-2.5 rounded-full`}
              style={{ width: `${quotaPercent}%` }}
            ></div>
          </div>
          <span className="text-xs mt-1">{`${remainingQuota}/${totalQuota} pages`}</span>
        </>
      )}
    </div>
  );
};

export default QuotaDisplay;
