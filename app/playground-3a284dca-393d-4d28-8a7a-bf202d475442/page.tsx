'use client';
import PlaygroundPageContainer from '../components/playground/PlaygroundPageContainer';

const PlaygroundPage = () => {
  return <PlaygroundPageContainer production={true} auth0Enabled={false} />;
};

export default PlaygroundPage;
