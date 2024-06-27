import { Sparkle } from '@phosphor-icons/react';

interface ComingSoonBannerProps {
  text?: string;
}

const ComingSoonBanner = ({ text }: ComingSoonBannerProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4 border-solid border-2 border-neutral-200 rounded-lg text-center font-semibold text-2xl text-neutral-800 gap-2">
      {text || 'Coming soon'}
      <Sparkle size={24} />
    </div>
  );
};

export default ComingSoonBanner;
