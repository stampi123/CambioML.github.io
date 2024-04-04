import useInfoModal from '@/app/hooks/useInfoModal';
import { Question } from '@phosphor-icons/react';
import { PlaygroundTabs } from '@/app/types/PlaygroundTypes';

interface InfoButtonProps {
  infoType: string;
}

const textStyle = 'text-lg text-neutral-700 flex flex-col gap-2';
const h1Style = 'text-2xl font-semibold';
const h2Style = 'text-xl font-semibold pt-4';

const extractContent = (
  <>
    <div className={h1Style}>Extract</div>
    <div className={textStyle}>
      <div>
        With Uniflow, you can extract the content from your raw, unstructured data, like PDFs, TXTs, and HTML files.
      </div>
      <div>
        {`Once you've uploaded and selected a file, run the Uniflow 'Extract' flow, which will extract the content of your file and return it in a Markdown format.`}
      </div>
    </div>
    <div className={h2Style}>Next Steps</div>
    <div
      className={textStyle}
    >{`You can download the output as a text file, as well as then use the 'Transform' flow to transform your extracted data into a structured format.`}</div>
  </>
);
const transformContent = (
  <>
    <div className={h1Style}>Transform</div>
    <div className={textStyle}>
      {`With Uniflow, you can transform your raw, unstructured data into a structured format. In this Playground, you can use the built-in 'Summarize' and 'Question-Answer' models to transform your data.`}
    </div>
    <div className={h2Style}>Key-value Generation</div>
    <div
      className={textStyle}
    >{`One option is to generate key-values from your file. You can input a query of certain data that you want, and Uniflow will return that data and it's values in a JSON dictionary.`}</div>
    <div className={h2Style}>Generate Question-Answer Pairs (Coming Soon)</div>
    <div
      className={textStyle}
    >{`Another option is to convert your text to Question-Answer pairs. Uniflow will take each paragraph in your file and generate a single question and answer based on that paragraph.`}</div>
    <div className={h2Style}>Summarize (Coming Soon)</div>
    <div
      className={textStyle}
    >{`Another option is to generate summaries from your file. Uniflow will take each paragraph in your file and generate a short summary based on that paragraph.`}</div>
    <div className={h2Style}>Next Steps</div>
    <div className={textStyle}>{`Once you've run the generation, you can download the data.`}</div>
  </>
);

const compareContent = (
  <>
    <div className={h1Style}>Compare (Coming Soon)</div>
    <div className={textStyle}>{`With Uniflow, you can run a flow to compare two papers.`}</div>
    <div className={h2Style}>Input</div>
    <div className={textStyle}>{`Two paper files.`}</div>
    <div className={h2Style}>Output</div>
    <div className={textStyle}>{`Comparison of each section of the paper (Abstract, Conclusion, etc.)`}</div>
  </>
);

const infoContent: { [key: string]: React.ReactElement } = {
  [PlaygroundTabs.EXTRACT]: extractContent,
  [PlaygroundTabs.TRANSFORM]: transformContent,
  [PlaygroundTabs.COMPARE]: compareContent,
};

const InfoButton = ({ infoType }: InfoButtonProps) => {
  const infoModal = useInfoModal();
  const handleInfoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    infoModal.setContent(infoContent[infoType] || '');
    infoModal.onOpen();
  };
  return (
    <button
      onClick={handleInfoClick}
      className="w-fit h-fit hover:text-cambio-red rounded-full text-neutral-700 p-1 font-bold transition duration-300"
    >
      <Question size={18} weight="bold" />
    </button>
  );
};

export default InfoButton;
