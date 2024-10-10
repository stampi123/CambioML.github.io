import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface BlogLaTeXProps {
  latex: string;
}

const BlogLaTeX = ({ latex }: BlogLaTeXProps) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md my-4 overflow-x-auto">
      <div className="inline-block min-w-full">
        <BlockMath math={latex} />
      </div>
    </div>
  );
};

export default BlogLaTeX;
