import CodeBlock from "./CodeBlock";
import FeatureImage from "./feature/FeatureImage";

interface DemoTabProps {
    code: string;
    image: string;
    alt: string;
}

const DemoTab:React.FC<DemoTabProps> = ({code, image, alt}) => {
  return (
    <div className="flex gap-5 py-4 w-full xl:w-[80vw] min-w-full h-full xl:h-[500px] grid grid-cols-1 xl:grid-cols-2 gap-0 xl:relative xl:left-[calc(50%-40vw)]">
                                <CodeBlock code={code} showLineNumbers center/>
                            <div className="w-full flex items-center justify-center">
                                <FeatureImage image={image} alt={alt} height="h-[500px]" />
                            </div>
                        </div>
  )
};

export default DemoTab;