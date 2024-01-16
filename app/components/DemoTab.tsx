import CodeBlock from "./CodeBlock";
import FeatureImage from "./feature/FeatureImage";

interface DemoTabProps {
    code: string;
    image: string;
    alt: string;
}

const DemoTab: React.FC<DemoTabProps> = ({ code, image, alt }) => {
    return (
        // <div className="w-full flex justify-content">
            <div className="gap-5 py-4 w-full xl:w-[80vw] max-w-screen-xl h-full xl:h-[500px] grid grid-cols-1 xl:grid-cols-2 gap-0 xl:absolute xl:left-[50%] xl:translate-x-[-50%]">
                <CodeBlock code={code} showLineNumbers center />
                <div className="w-full flex items-center justify-center">
                    <FeatureImage image={image} alt={alt} height="h-[500px]" />
                </div>
            </div>
        // </div>
    )
};

export default DemoTab;