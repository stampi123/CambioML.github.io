import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Image from 'next/image';

interface BlogImageProps {
  imagePath: string;
  alt: string;
  subtitle?: string;
}

const BlogImage = ({ imagePath, alt, subtitle }: BlogImageProps) => {
  return (
    <div className="mb-6">
      <Image alt={alt} src={imgPrefix + imagePath} width={600} height={400} className="block mx-auto" />
      {subtitle && <p className="text-center text-sm text-neutral-500">{subtitle}</p>}
    </div>
  );
};

export default BlogImage;
