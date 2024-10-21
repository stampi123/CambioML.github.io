import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Image from 'next/image';

interface BlogImageProps {
  src: string;
  alt: string;
  subtitle?: string;
}

const BlogImage = ({ src, alt, subtitle }: BlogImageProps) => {
  return (
    // Responsive:
    // - Image width is full on all devices, height auto-adjusts
    // - Margin bottom adjusts for better spacing on different devices
    <div className="mb-4 sm:mb-6">
      <Image
        alt={alt}
        src={imgPrefix + '/images/solutions/' + src}
        width={1200}
        height={800}
        className="block w-full h-auto"
      />
      {subtitle && (
        // Responsive:
        // - Text size and padding adjust for readability on different devices
        <p className="text-center text-xs sm:text-sm text-neutral-500 pt-1 sm:pt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default BlogImage;
