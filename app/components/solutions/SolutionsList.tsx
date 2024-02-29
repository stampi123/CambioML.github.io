import SolutionsCard from './SolutionsCard';

interface SolutionsListProps {
  solutions: {
    title: string;
    subtitle?: string;
    description?: string;
    url: string;
    image: string;
  }[];
}

const SolutionsList = ({ solutions }: SolutionsListProps) => {
  return (
    <div className="grid grid-cols-1 w-full h-fit gap-10 pb-20">
      {solutions.map((solution, index) => (
        <SolutionsCard key={index} {...solution} />
      ))}
    </div>
  );
};

export default SolutionsList;
