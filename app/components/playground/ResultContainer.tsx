import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultContainerProps {
  extractResult: string;
}

const ResultContainer = ({ extractResult }: ResultContainerProps) => {
  return (
    <div className="overflow-auto relative w-full h-full rounded-xl border border-1 border-solid">
      <Markdown className="markdown p-4 absolute whitespace-pre-wrap" remarkPlugins={[remarkGfm]}>
        {`${extractResult}`}
      </Markdown>
    </div>
  );
};

export default ResultContainer;
