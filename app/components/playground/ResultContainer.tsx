import { QueryResult } from '@/app/actions/apiInterface';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultContainerProps {
  extractResult: QueryResult;
}

const ResultContainer = ({ extractResult }: ResultContainerProps) => {
  return (
    <div className="overflow-auto relative w-full h-full rounded-xl border border-1 border-solid">
      <Markdown className="markdown p-4 absolute whitespace-pre-wrap" remarkPlugins={[remarkGfm]}>
        {`${extractResult.join('\n\n')}`}
      </Markdown>
    </div>
  );
};

export default ResultContainer;
