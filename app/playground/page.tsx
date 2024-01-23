import Container from '../components/Container';
import Heading from '../components/Heading';

const PlaygroundPage = () => {
  return (
    <Container styles="min-h-[80vh]">
      <div className="py-20">
        <Heading title="Playground" subtitle="Coming soon!" center />
      </div>
    </Container>
  );
};

export default PlaygroundPage;
