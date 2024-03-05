'use client';

import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';

interface SolutionsCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  image?: string;
}

const createId = (title: string) => {
  return title.toLowerCase().replaceAll(' ', '-');
};

const SolutionsCard = ({ title, subtitle, description, url, image }: SolutionsCardProps) => {
  return (
    <a target="_blank" href={url} rel="noopener noreferrer">
      <div
        className="
        col-span-1
        cursor-pointer
        group
        h-fit
        pt-20
        "
        id={createId(title)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-fit md:h-[400px] border-solid border-2 rounded-3xl xl:rounded-4xl hover:shadow-md">
          <div
            className="
                    aspect-square
                    w-full
                    h-[400px]
                    md:h-full
                    relative
                    overflow-hidden
                    rounded-[inherit]
                    rounded-b-none
                    md:rounded-r-none
                    md:rounded-l-[inherit]
                    border-solid
                    border-b-2
                    border-neutral-200
                    md:border-r-2
                    md:border-b-0
                    "
          >
            <Image
              fill
              alt="Solution Image"
              src={imgPrefix + (image || '/images/cambioml-logo-large.png')}
              className="
                            object-cover
                            h-full
                            w-full
                            group-hover:scale-110
                            transition
                            "
            />
          </div>
          <div className="flex flex-col md:justify-center p-5 h-[300px] md:h-full gap-5">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-xl">{title.toUpperCase()}</div>
              {subtitle && <div className="text-xl italic">{subtitle}</div>}
            </div>
            {description && <div className="text-lg" dangerouslySetInnerHTML={{ __html: description }} />}
          </div>
        </div>
      </div>
    </a>
  );
};

export default SolutionsCard;
