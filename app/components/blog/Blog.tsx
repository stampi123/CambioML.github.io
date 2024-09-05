'use client';
import { CaretLeft } from '@phosphor-icons/react';
import PageHero from '../hero/PageHero';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BlogProps {
  title: string;
  publishedOn: string;
  children: React.ReactNode;
  writtenBy: string;
}

const Blog = ({ title, publishedOn, children, writtenBy }: BlogProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center ">
      <PageHero title={title} short />
      <div className="px-10 pb-10 w-full max-w-4xl min-h-[1000px]">
        <div className="w-full py-2 flex gap-2 items-center justify-between">
          <div className="text-md italic">{publishedOn}</div>
          <div
            className=" flex gap-2 p-2 items-center justify-center cursor-pointer hover:font-semibold rounded-xl hover:bg-neutral-100"
            onClick={() => router.push('/blog')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CaretLeft size={16} weight={isHovered ? 'bold' : 'regular'} /> Back to Blogs
          </div>
        </div>
        {children}
        <hr className="my-6" />
        <p className="text-lg italic">Written by {writtenBy}</p>
      </div>
    </div>
  );
};

export default Blog;
