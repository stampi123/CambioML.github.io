import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Image from 'next/image';

interface FeatureImageProps {
  image: string;
  alt: string;
  height?: string;
  shadow?: boolean;
}

const FeatureImage = ({ image, alt, height, shadow }: FeatureImageProps) => {
  return (
    <div
      className={`border-solid border-2 border-neutral-100 ${shadow && 'shadow-lg'} rounded-xl w-full ${height || 'h-[600px]'} relative`}
    >
      <Image src={imgPrefix + image} fill style={{ objectFit: 'contain' }} alt={alt} />
    </div>
  );
};

export default FeatureImage;
