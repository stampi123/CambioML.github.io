'use client';

import Container from '../components/Container';
import Heading from '../components/Heading';
import useUserId from '../hooks/useUserId';

const PlaygroundPage = () => {
  const userId = useUserId();
  return (
    <Container styles="min-h-[80vh]">
      <div className="py-20">
        <Heading title="Playground" subtitle="Coming soon!" center />
        User id: {userId}
      </div>
    </Container>
  );
};

export default PlaygroundPage;
