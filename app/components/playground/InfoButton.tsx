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

const mapContent = (
  <>
    <div className={h1Style}>Map (Coming Soon)</div>
  </>
);

const infoContent: { [key: string]: React.ReactElement } = {
  [PlaygroundTabs.EXTRACT]: extractContent,
  [PlaygroundTabs.MAP]: mapContent,
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
