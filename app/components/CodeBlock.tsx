import { CopyBlock, dracula } from 'react-code-blocks';

interface CodeBlockProps {
    code: string;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    center?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, showLineNumbers, wrapLines, center }) => {
    return (
        <div className={`w-full h-full ${center && 'xl:flex xl:items-center xl:justify-center'} rounded-lg`}>
            <CopyBlock
                text={code}
                language="python"
                showLineNumbers={showLineNumbers}
                theme={dracula}
                wrapLongLines={wrapLines}
                codeBlock
                />
        </div>
    )
};

export default CodeBlock;