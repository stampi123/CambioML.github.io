'use client';
import PlaygroundPageContainer from '../components/playground/PlaygroundPageContainer';

const PlaygroundPage = () => {
  return <PlaygroundPageContainer production={false} auth0Enabled={true} />;
};

export default PlaygroundPage;
