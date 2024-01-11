'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { imgPrefix } from '@/app/hooks/useImgPrefix';

interface LogoProps {
  small?: boolean;
}

const Logo: React.FC<LogoProps> = ({small}) => {
  const router = useRouter();

  return (
    <Image
      alt="Logo"
      className="cursor-pointer"
      height={small ? '100' : '175'}
      width={small ? '100' : '175'}
      src={imgPrefix + '/images/logo.png'}
      onClick={() => router.push('/')}
    />
  )
}
export default Logo;