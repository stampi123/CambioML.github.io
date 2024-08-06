'use client';

import { QueryResult } from '@/app/actions/apiInterface';
import useCompareModal from '@/app/hooks/useCompareModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import { CaretLeft, CaretRight, Files, FrameCorners } from '@phosphor-icons/react';
import { useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultContentProps {
  extractResult: QueryResult;
}

const ResultContent = ({ extractResult }: ResultContentProps) => {
  const resultZoomModal = useResultZoomModal();

  const handleNextPageClick = () => {
    const nextPage = (resultZoomModal.page + 1) % extractResult.length;
    resultZoomModal.setPage(nextPage);
  };

  const handlePrevPageClick = () => {
    const prevPage = (resultZoomModal.page - 1 + extractResult.length) % extractResult.length;
    resultZoomModal.setPage(prevPage);
  };

  return (
    <>
      <div
        className="absolute top-1/2 right-5 z-10 cursor-pointer p-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800 hover:bg-neutral-200 font-semibold"
        onClick={handleNextPageClick}
      >
        <CaretRight size={18} weight="bold" />
      </div>
      <div
        className="absolute top-1/2 left-5 z-10 cursor-pointer p-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800 hover:bg-neutral-200 font-semibold"
        onClick={handlePrevPageClick}
      >
        <CaretLeft size={18} weight="bold" />
      </div>
      <div className="absolute bottom-5 right-5 z-10 p-2 rounded-full text-neutral-600 bg-white font-semibold">
        Page {resultZoomModal.page + 1} of {extractResult.length}
      </div>
      <div className="overflow-auto relative w-full h-full rounded-xl border border-1 border-solid px-10">
        {hasHtmlTags(extractResult.join('')) ? (
          <div
            className="p-4 absolute whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: extractResult[resultZoomModal.page] }}
          />
        ) : (
          <Markdown className="markdown p-4 absolute whitespace-pre-wrap" remarkPlugins={[remarkGfm]}>
            {extractResult[resultZoomModal.page]}
          </Markdown>
        )}
      </div>
    </>
  );
};

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

interface ResultContainerProps {
  extractResult: QueryResult;
}

const ResultContainer = ({ extractResult }: ResultContainerProps) => {
  const { files, selectedFileIndex } = usePlaygroundStore();
  const resultZoomModal = useResultZoomModal();
  const compareModal = useCompareModal();

  const handleZoomClick = () => {
    resultZoomModal.setContent(
      <div className="overflow-auto relative w-full h-[80vh]">
        <ResultContent extractResult={extractResult} />
      </div>
    );
    resultZoomModal.onOpen();
  };

  const handleCompareClick = () => {
    compareModal.setContent(
      <div className="w-full h-full">
        {hasHtmlTags(extractResult.join('')) ? (
          <div
            className="p-4 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: extractResult
                .map(
                  (content, index) =>
                    `<div>${content}</div>
                <div style="font-weight: bold; position: relative; margin-top: 5px;">
                    <span style="position: absolute; right: 0; bottom: 0;">Page ${index + 1}</span>
                </div>
                <hr style="margin-top: 10px; margin-bottom: 20px;">`
                )
                .join(''),
            }}
          />
        ) : (
          <Markdown className="markdown p-4 whitespace-pre-wrap" remarkPlugins={[remarkGfm]}>
            {extractResult
              .map((content, index) => {
                return `${content}\n\n**Page ${index + 1}**\n\n---\n\n`;
              })
              .join('')}
          </Markdown>
        )}
      </div>
    );
    compareModal.onOpen();
  };
  useEffect(() => {
    resultZoomModal.setPage(0);
  }, [extractResult]);

  useEffect(() => {
    if (selectedFileIndex !== null && files[selectedFileIndex]) {
      const thisFile = files[selectedFileIndex].file;
      compareModal.setFile(thisFile as File);
    }
  }, [files, selectedFileIndex]);

  return (
    <div className="w-full h-full relative">
      <div
        className="absolute top-5 right-5 z-10 cursor-pointer px-4 py-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800   hover:bg-neutral-200 font-semibold flex items-center gap-1"
        onClick={handleZoomClick}
      >
        Expand <FrameCorners size={18} weight="bold" />
      </div>
      <div
        className="absolute top-5 right-[134px] z-10 cursor-pointer p-2 rounded-full text-neutral-600 bg-neutral-100 hover:text-neutral-800 hover:bg-neutral-200 font-semibold flex items-center gap-1"
        onClick={handleCompareClick}
      >
        Compare <Files size={18} weight="bold" />
      </div>
      <ResultContent extractResult={extractResult} />
    </div>
  );
};

export default ResultContainer;
