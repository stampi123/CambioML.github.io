import { ApiKey } from '@/app/hooks/useAccountStore';
import { Copy } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short',
};

interface ApiKeyRowProps {
  apiKey: ApiKey;
}

const ApiKeyRow = ({ apiKey }: ApiKeyRowProps) => {
  const maskApiKey = (key: string) => {
    if (key.length <= 6) {
      return key; // No need to mask if the key is too short
    }
    const maskedLength = key.length - 6;
    const maskedPart = '•'.repeat(maskedLength);
    return `${key.slice(0, 3)}${maskedPart}${key.slice(-3)}`;
  };

  const maskedKey = maskApiKey(apiKey.key);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.key);
    toast.success('API Key copied to clipboard!');
  };

  return (
    <div className="w-full bg-neutral-100 p-2 rounded-xl grid grid-cols-[1fr_250px] gap-4 items-center text-neutral-800">
      <div className="border-r-[1px] border-neutral-200 flex items-center justify-between px-4">
        {maskedKey}
        <button
          className="p-2 bg-neutral-200 text-neutral-600 rounded-md hover:bg-neutral-500 hover:text-white focus:outline-none"
          onClick={copyToClipboard}
        >
          <Copy size={16} />
        </button>
      </div>
      <div>
        <span className="font-semibold">Created: </span>
        {new Date(apiKey.createdAt).toLocaleDateString('en-US', options)}
      </div>
    </div>
  );
};

export default ApiKeyRow;
