import { Sparkle } from '@phosphor-icons/react';

const ComingSoonBanner = () => {
  return (
    <div className="w-full flex items-center justify-center p-4 border-solid border-2 border-neutral-200 rounded-lg text-center font-semibold text-xl text-neutral-800 gap-2">
      Coming soon
      <Sparkle size={24} />
    </div>
  );
};

export default ComingSoonBanner;
