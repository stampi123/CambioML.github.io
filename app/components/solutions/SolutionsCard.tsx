'use client';

import Image from 'next/image';
import { imgPrefix } from '@/app/hooks/useImgPrefix';

interface SolutionsCardProps {
    title: string;
    description?: string;
    url: string;
    image?: string;
}

const SolutionsCard: React.FC<SolutionsCardProps> = ({
    title,
    description,
    url,
    image,
}) => {
    return (
        <a target="_blank" href={url} rel="noopener noreferrer">
            <div
                className="
        col-span-1
        cursor-pointer
        group
        "
            >
                <div className="flex flex-col gap-2 w-full border-solid border-2 rounded-3xl xl:rounded-4xl hover:shadow-md">
                    <div
                        className="
                    aspect-square
                    w-full
                    relative
                    overflow-hidden
                    rounded-[inherit]
                    rounded-b-none
                    border-solid
                    border-b-2
                    border-neutral-200
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
                    <div className="flex flex-col p-5 h-[200px] gap-5">
                        <div className="font-semibold text-xl">
                            {title.toUpperCase()}
                        </div>
                        <div
                            className="text-lg"
                        >
                            {description}
                        </div>
                    </div>
                </div>
            </div>
        </a>
    )
};

export default SolutionsCard;