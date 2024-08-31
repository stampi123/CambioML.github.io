'use client';

import { useEffect, useState } from 'react';
import SolutionsCard from './SolutionsCard';
import { SolutionType, solutions } from '@/app/blog/data';
import { CaretLeft } from '@phosphor-icons/react/dist/ssr';
import { CaretRight } from '@phosphor-icons/react';

interface SolutionsCarouselProps {
  sortNewest?: boolean;
}

const SolutionsCarousel = ({ sortNewest }: SolutionsCarouselProps) => {
  const [sortedSolutions, setSortedSolutions] = useState<SolutionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const sorted = [...solutions].sort((a, b) => {
      if (sortNewest) {
        return b.date.getTime() - a.date.getTime();
      }
      return a.date.getTime() - b.date.getTime();
    });
    setSortedSolutions(sorted);
  }, [sortNewest]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === sortedSolutions.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [sortedSolutions.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? sortedSolutions.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === sortedSolutions.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full h-[800px] lg:h-[500px] overflow-hidden flex items-center pl-[65px]">
      <div
        className="absolute flex flex-row items-start gap-[65px] transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 940}px)` }}
      >
        {sortedSolutions.map((solution, index) => (
          <div key={index} className="w-[875px]">
            <SolutionsCard key={index} {...solution} />
          </div>
        ))}
      </div>
      <button
        onClick={handlePrevClick}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
      >
        <CaretLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNextClick}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
      >
        <CaretRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SolutionsCarousel;
