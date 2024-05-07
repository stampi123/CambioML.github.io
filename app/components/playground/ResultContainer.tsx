import { QueryResult } from '@/app/actions/apiInterface';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultContainerProps {
  extractResult: QueryResult;
}

function hasHtmlTags(input: string): boolean {
  const htmlTagsRegex = /<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/; // Improved Regex

  return htmlTagsRegex.test(input);
}

const ResultContainer = ({ extractResult }: ResultContainerProps) => {
  return (
    <div className="overflow-auto relative w-full h-full rounded-xl border border-1 border-solid">
      {hasHtmlTags(extractResult.join('')) ? (
        <div
          className="p-4 p-4 absolute whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: extractResult.join('') }}
        />
      ) : (
        <Markdown className="markdown p-4 absolute whitespace-pre-wrap" remarkPlugins={[remarkGfm]}>
          {`${extractResult.join('\n\n')}`}
        </Markdown>
      )}
    </div>
  );
};

export default ResultContainer;
