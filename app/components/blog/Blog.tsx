'use client';
import { CaretLeft } from '@phosphor-icons/react';
import PageHero from '../hero/PageHero';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BlogLink from './BlogLink';

interface Author {
  name: string;
  companyName: string;
  companyUrl: string;
}

interface BlogProps {
  title: string;
  publishedOn: string;
  children: React.ReactNode;
  authors: Author[];
}

const Blog = ({ title, publishedOn, children, authors }: BlogProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    // Outer container - full width and height, centered content
    // Responsive: Works for both mobile and desktop
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title={title} short />
      {/* Main content container
          Responsive: 
          - Padding adjusts from small (mobile) to large (desktop) screens
          - Max width ensures readability on very wide screens
          - Minimum height ensures content area isn't too short on tall screens */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 pb-10 w-full max-w-4xl min-h-[50vh]">
        {/* Date and Back button container
            Responsive: 
            - Stacks vertically on mobile (flex-col)
            - Side-by-side on larger screens (sm:flex-row)
            - Alignment and spacing adjust for different layouts */}
        <div className="w-full py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Date - larger text on desktop for better visibility */}
          <div className="text-base sm:text-lg italic">{publishedOn}</div>
          {/* Back to Blogs button
              Responsive: 
              - Text size increases on larger screens
              - Hover effects work on desktop, tap-friendly size on mobile */}
          <div
            className="flex gap-2 p-2 items-center justify-center cursor-pointer hover:font-semibold rounded-xl hover:bg-neutral-100 text-base sm:text-lg"
            onClick={() => router.push('/blog')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Icon size good for tapping on mobile, visible on desktop */}
            <CaretLeft size={20} weight={isHovered ? 'bold' : 'regular'} /> Back to Blogs
          </div>
        </div>
        {/* Authors section
            Responsive: 
            - Text size increases on larger screens
            - Flex-wrap allows proper layout on both mobile and desktop
            - Spacing adjusts for wrapped items */}
        <div className="text-lg sm:text-xl italic flex flex-wrap pb-6 sm:pb-8">
          Authors:&nbsp;
          {authors.map((author, i) => (
            <div key={author.name} className="mr-3 mb-1">
              {i > 0 && '; '}
              {author.name} @ <BlogLink text={author.companyName} url={author.companyUrl} />
            </div>
          ))}
        </div>
        {/* Main content area
            Responsive: 
            - Uses Tailwind Typography for responsive text sizing
            - Base size good for mobile, increases for larger screens
            - Specific styles for headings and paragraphs ensure readability across devices */}
        <div className="prose prose-base sm:prose-lg lg:prose-xl max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-lg prose-li:text-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Blog;
