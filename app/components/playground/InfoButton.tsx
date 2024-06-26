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
    <div className={h1Style}>Map</div>
    <div className={textStyle}>
      <div>With Uniflow, you can extract tables from your PDFs and extract specific keys from them.</div>
    </div>
    <div className={h2Style}>1. Select Tables</div>
    <div
      className={textStyle}
    >{`Once you've selected a PDF with tables, first you need to extract those tables. After running the table extract, select the tables that you'd like to extract data from.

    In this section, you'll also have the ability to preview the raw extracted data.`}</div>
    <div className={h2Style}>2. Map Schema</div>
    <div
      className={textStyle}
    >{`Once you've exracted and selected the tables, you can then add the keys that you want to extract. If you wish to remove the mapped key, click the (X) in the box. If you wish to remove an Input Key, you can click the (X) icon in its box.

    Once you've added some keys, you can run the Map Schema function. After mapping, you can edit any of the mapped keys by clicking on the edit pencil icon.


    Clicking 'Map Schema' again will only re-run the Input Keys without any Mapped Keys. If you wish to generate a new mapped key, you can remove the Mapped Key first by clicking X.`}</div>
    <div className={h2Style}>Next Steps</div>
    <div
      className={textStyle}
    >{`Once you're satisfied with the output, you can hit the Download JSON button to get a JSON copy of your keys. This will only be enabled if at least one Input Key has a non-empty Mapped Key.`}</div>
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
