'use client';

import { useState } from "react";
import Image from "next/image";
import DemoTab from "../DemoTab";
import { imgPrefix } from "@/app/hooks/useImgPrefix";
import CodeBlock from "../CodeBlock";

const STATE = {
    UNIFLOW: 0,
    PYKOI: 1,
    AUTOEVAL: 2,
}

const FlowOverview = () => {
    const [tab, setTab] = useState(0);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        setTab(index);
    }

    const selectedStyles = "text-white bg-cambio-red";
    const unselectedStyles = "text-neutral-500 bg-neutral-200";

    return (
        <div className="flex flex-col items-center align-center w-full">
            <div className="h-[400px] grid grid-cols-[200px_105px_200px_80px_275px_120px_140px] w-[1115px] py-5">
                <FlowImage image="/images/graphics/cambio-flow-1.png" alt="PDF, HTML, IMAGES"/>
                <div className={`col-span-1 flex items-center justify-center`}>
                    <div className={`cursor-pointer text-2xl p-3 rounded-lg ${tab === STATE.UNIFLOW ? selectedStyles : unselectedStyles}`} onClick={(e) => handleClick(e, STATE.UNIFLOW)}>
                        Extract
                    </div>
                </div>
                <FlowImage image="/images/graphics/cambio-flow-2.png" alt="Structured QAs"/>
                <div className={`col-span-1 flex items-center justify-center`}>
                    <div className={`cursor-pointer text-2xl p-3 rounded-lg ${tab === STATE.PYKOI ? selectedStyles : unselectedStyles}`} onClick={(e) => handleClick(e, STATE.PYKOI)}>
                        Train
                    </div>
                </div>
                <FlowImage image="/images/graphics/cambio-flow-3.png" alt="LLMs"/>
                <div className={`col-span-1 flex items-center justify-center`}>
                    <div className={`cursor-pointer text-2xl p-3 rounded-lg ${tab === STATE.AUTOEVAL ? selectedStyles : unselectedStyles}`} onClick={(e) => handleClick(e, STATE.AUTOEVAL)}>
                        Validate
                    </div>
                </div>
                <FlowImage image="/images/graphics/cambio-flow-4.png" alt="Users"/>
            </div>
            <div className="lg:h-[600px] w-full py-5 rounded-lg">
                {(tab === STATE.UNIFLOW) &&
                    <CodeBlock code={`from uniflow import ExtractMarkdowClient

client = ExtractMarkdowClient()

output = client.run(data)`}
                        language="python"
                    />

                }
                {(tab === STATE.PYKOI) &&
                    <DemoTab code={`from pykoi import Finetuning, RLHFConfig

rlhf = Finetuning(RLHFConfig)

rlhf.train_and_save("./models")`}
                        image="/images/pykoi/pykoi-rag-chatbot-modify.gif"
                        alt="Pykoi rag chatbot demo" />
                }
                {(tab === STATE.AUTOEVAL) &&
                    <DemoTab code={`from uniflow import AutoRater

client = AutoRater()

output = client.run(data)`}
                        image="/images/pykoi/comparison-chat.gif"
                        alt="Autoeval Chat Comparisons" />
                }
            </div>
        </div>)

};

interface FlowImageProps {
    image: string;
    alt: string;
}

const FlowImage:React.FC<FlowImageProps> = ({image, alt}) => {
    return (
        <div className="col-span-1 flex items-center justify-center relative">
            <Image src={imgPrefix + image} alt={alt} fill style={{ objectFit: "contain" }} />
        </div>
    )
}

export default FlowOverview;