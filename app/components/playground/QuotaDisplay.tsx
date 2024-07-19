import React from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';

const QUOTA_YELLOW_THRESHOLD = 50;
const QUOTA_ORANGE_THRESHOLD = 25;
const QUOTA_RED_THRESHOLD = 15;

const QuotaDisplay = () => {
  const { totalQuota, remainingQuota } = usePlaygroundStore();
  const quotaPercent = (remainingQuota / totalQuota) * 100;
  return (
    <div className="w-full flex flex-col items-center pt-2">
      <div className="w-full flex justify-between items-center mb-2">
        <span className="font-semibold text-lg">Quota</span>
      </div>
      <div
        className={`w-full ${remainingQuota === 0 ? 'bg-red-300' : 'bg-neutral-300'} rounded-full h-2.5 flex justify-end`}
      >
        <div
          className={`${quotaPercent > QUOTA_YELLOW_THRESHOLD && 'bg-green-500'} ${quotaPercent > QUOTA_ORANGE_THRESHOLD && quotaPercent <= QUOTA_YELLOW_THRESHOLD && 'bg-yellow-500'} ${quotaPercent > QUOTA_RED_THRESHOLD && quotaPercent <= QUOTA_ORANGE_THRESHOLD && 'bg-orange-500'}  ${quotaPercent <= QUOTA_RED_THRESHOLD && 'bg-red-500'}  h-2.5 rounded-full`}
          style={{ width: `${quotaPercent}%` }}
        ></div>
      </div>
      <span className="text-xs mt-1">{`${remainingQuota}/${totalQuota} pages`}</span>
    </div>
  );
};

export default QuotaDisplay;
