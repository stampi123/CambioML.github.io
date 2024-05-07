import { useState } from 'react';
import TableExtractContainer from './TableExtractContainer';
import MarkdownExtractContainer from './MarkdownExtractContainer';

enum ExtractMethod {
  FILE_EXTRACT,
  TABLE_EXTRACT,
}

const selectedTabStyle = 'text-neutral-800 border-b-4 border-neutral-800 font-semibold';
const unselectedTabStyle = 'text-neutral-500 border-neutral-200';
const tabStyle = 'p-2 text-center cursor-pointer border-solid border-b-2 hover:border-b-4 hover:font-semibold';

const ExtractContainer = () => {
  const [extractMethod, setExtractMethod] = useState<ExtractMethod>(ExtractMethod.FILE_EXTRACT);

  return (
    <div className="h-full w-full grid-row-1 grid grid-rows-[50px_1fr] gap-4">
      <div className="w-full grid grid-cols-2 pt-2">
        <div
          className={`${extractMethod === ExtractMethod.FILE_EXTRACT ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => setExtractMethod(ExtractMethod.FILE_EXTRACT)}
        >
          Extract Content
        </div>
        <div
          className={`${extractMethod === ExtractMethod.TABLE_EXTRACT ? selectedTabStyle : unselectedTabStyle} ${tabStyle}`}
          onClick={() => setExtractMethod(ExtractMethod.TABLE_EXTRACT)}
        >
          Extract Table
        </div>
      </div>
      <div>
        {extractMethod === ExtractMethod.TABLE_EXTRACT && <TableExtractContainer />}
        {extractMethod === ExtractMethod.FILE_EXTRACT && <MarkdownExtractContainer />}
      </div>
    </div>
  );
};

export default ExtractContainer;
