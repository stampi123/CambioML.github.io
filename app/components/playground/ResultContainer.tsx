import { QueryResult } from '@/app/actions/apiInterface';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import { FrameCorners } from '@phosphor-icons/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultContainerProps {
  extractResult: QueryResult;
}

function countHtmlTags(input: string): number {
  const htmlTagsRegex = /<([a-z]+)([^<]*)>/gi;
  let count = 0;

  input.replace(htmlTagsRegex, () => {
    count++;
    return '';
  });

  return count;
}

function hasHtmlTags(input: string): boolean {
  const tagCount = countHtmlTags(input);
  return tagCount > 10;
}

const ResultContainer = ({ extractResult }: ResultContainerProps) => {
  const resultZoomModal = useResultZoomModal();

  const handleZoomClick = () => {
    resultZoomModal.setContent(
      <div className="overflow-auto relative w-full h-full">
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
    resultZoomModal.onOpen();
  };
  return (
    <div className="w-full h-full relative">
      <div
        className="absolute top-5 right-5 z-10 cursor-pointer p-2  rounded-full text-neutral-600 bg-white  hover:text-neutral-800 hover:bg-neutral-100 font-semibold"
        onClick={handleZoomClick}
      >
        <FrameCorners size={18} weight="bold" />
      </div>
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
    </div>
  );
};

export default ResultContainer;
