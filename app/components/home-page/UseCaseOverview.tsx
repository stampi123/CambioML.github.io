'use client';

import { useState } from 'react';
import UseCaseTab from './UseCaseTab';

enum TAB {
  ML,
  RD,
  PORTFOLIO,
}

const UseCaseOverview = () => {
  const [tab, setTab] = useState(TAB.ML);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setTab(index);
  };

  const selectedStyles = 'text-white bg-cambio-red shadow-md';
  const unselectedStyles =
    'text-neutral-500 bg-neutral-200 hover:bg-neutral-300 hover:shadow-md hover:text-neutral-700 transition-all duration-200 ease-in-out';
  const commonStyles = 'cursor-pointer text-2xl p-3 rounded-lg';

  return (
    <div className="flex flex-col items-center align-center w-full">
      <div className="h-[100px] w-full flex justify-between py-5">
        <div
          className={`${commonStyles} ${tab === TAB.ML ? selectedStyles : unselectedStyles}`}
          onClick={(e) => handleClick(e, TAB.ML)}
        >
          ML Scientists
        </div>
        <div
          className={`${commonStyles} ${tab === TAB.RD ? selectedStyles : unselectedStyles}`}
          onClick={(e) => handleClick(e, TAB.RD)}
        >
          R&D Engineers
        </div>
        <div
          className={`${commonStyles} ${tab === TAB.PORTFOLIO ? selectedStyles : unselectedStyles}`}
          onClick={(e) => handleClick(e, TAB.PORTFOLIO)}
        >
          Portfolio Managers
        </div>
      </div>
      <div className="lg:h-[800px] py-5 rounded-lg">
        {tab === TAB.ML && (
          <UseCaseTab
            code={`from uniflow import ExtractPDFClient

client = ExtractPDFClient()

output = client.run(data)`}
            benefits={[
              'Get your training data ready for your private LLMs',
              'Reduce time spent on data cleaning by up to 90%',
              'Aggregate knowledge from multi-formats including PDFs and HTMLs',
            ]}
            image="/images/graphics/cambio-flow-ml.png"
            imageTitle="Your Own GPUs"
            alt="RD rag chatbot demo"
          />
        )}
        {tab === TAB.RD && (
          <UseCaseTab
            code={`from uniflow import TransformQAGeneration

client = TransformQAGeneration()

output = client.run(data)`}
            benefits={[
              'Discover unknown research insights from 10x more data',
              'Answer the research related questions from unstructured data',
              'Accurately extract unstructured data from PDFs, HTMLs and Markdowns',
            ]}
            image="/images/graphics/cambio-flow-rd.png"
            imageTitle="Your Own Data Center or Cloud"
            alt="RD rag chatbot demo"
            detailsPath="/solutions/research-&-development"
          />
        )}
        {tab === TAB.PORTFOLIO && (
          <UseCaseTab
            benefits={[
              'Discover hidden investment signals from massive multi-format data',
              'Accelerate the discovery of revenue opportunity',
              'Accurately explain the signals by back-testing data',
            ]}
            image="/images/graphics/cambio-flow-portfolio.png"
            imageTitle="Your Corporate Laptop"
            alt="PORTFOLIO Chat Comparisons"
            demo="/images/pykoi/pykoi-rag-chatbot-modify.gif"
            detailsPath="/solutions/finance"
          />
        )}
      </div>
    </div>
  );
};

export default UseCaseOverview;
