import PageHero from '@/app/components/hero/PageHero';
import Container from '../../components/Container';
import SolutionsCard from '../../components/solutions/SolutionsCard';

const Solutions = [
  {
    title: 'Coming Soon!',
    description: 'Accelerate your R&D efforts with CambioML',
    url: 'https://www.cambioml.com',
    image: '',
  },
];

const ManufacturingSolutionsPage = () => {
  return (
    <div className="pb-10 w-full h-full">
      <PageHero title="Research & Development" description="Accelerate your R&D processes" />
      <div className="flex flex-col items-center justify-center py-20 gap-10"></div>
      <Container>
        <div className="pt-10 flex items-center justify-center">
          <div className="max-w-[1200px] w-full h-full">
            <div
              className="
                            mt-10
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-8
                            "
            >
              {Solutions.map((useCase, i) => (
                <SolutionsCard
                  key={useCase.title + i}
                  title={useCase.title}
                  description={useCase.description}
                  image={useCase.image}
                  url={useCase.url}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ManufacturingSolutionsPage;
