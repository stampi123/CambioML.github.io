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

  const selectedStyles = 'text-white bg-cambio-red';
  const unselectedStyles = 'text-neutral-500 bg-neutral-200';

  return (
    <div className="flex flex-col items-center align-center w-full">
      <div className="h-[100px] w-full flex justify-between py-5">
        <div
          className={`cursor-pointer text-2xl p-3 rounded-lg ${tab === TAB.ML ? selectedStyles : unselectedStyles}`}
          onClick={(e) => handleClick(e, TAB.ML)}
        >
          ML Scientists
        </div>
        <div
          className={`cursor-pointer text-2xl p-3 rounded-lg ${tab === TAB.RD ? selectedStyles : unselectedStyles}`}
          onClick={(e) => handleClick(e, TAB.RD)}
        >
          R&D Engineers
        </div>
        <div
          className={`cursor-pointer text-2xl p-3 rounded-lg ${tab === TAB.PORTFOLIO ? selectedStyles : unselectedStyles}`}
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
            title="Get your data for LLM training in few lines of code"
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
            title="Extract R&D insights from multiple sources of data"
            image="/images/graphics/cambio-flow-rd.png"
            imageTitle="Your Own Data Center or Cloud"
            alt="RD rag chatbot demo"
            detailsPath="/solutions/research-&-development"
          />
        )}
        {tab === TAB.PORTFOLIO && (
          <UseCaseTab
            title="Financial analysis for your own investment style"
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
