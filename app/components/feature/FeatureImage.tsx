import { imgPrefix } from "@/app/hooks/useImgPrefix";
import Image from "next/image";

interface FeatureImageProps {
  image: string;
  alt: string;
}

const FeatureImage: React.FC<FeatureImageProps> = ({image, alt}) => {
  return (
    <div className="flex flex-col items-center justify-center border-solid border-2 border-neutral-100 shadow-lg rounded-xl w-full h-[600px] relative">
    <Image
      src={imgPrefix + image}
      fill
      objectFit="contain"
      alt={alt}
    />
  </div>
  )
};

export default FeatureImage;