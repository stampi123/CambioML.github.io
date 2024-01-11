import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';

interface SocialButtonProps {
    image: string;
    url: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
    image,
    url
}) => {
    return (
        <div className="cursor-pointer rounded-md overflow-hidden h-[30px] w-[30px]">
            <a target="_blank" href={url} rel="noopener noreferrer">
                <Image
                    alt="Logo"
                    className="cursor-pointer"
                    height="100"
                    width="100"
                    src={imgPrefix + image}
                />
            </a>
        </div>
    )
};

export default SocialButton;