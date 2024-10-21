import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface BlogLaTeXProps {
  latex: string;
}

const BlogLaTeX = ({ latex }: BlogLaTeXProps) => {
  return (
    // Responsive:
    // - Padding and margin adjust for better spacing on different devices
    // - Overflow handling ensures content is accessible on smaller screens
    <div className="p-2 sm:p-4 bg-gray-100 rounded-md my-2 sm:my-4 overflow-x-auto">
      <div className="inline-block min-w-full">
        <BlockMath math={latex} />
      </div>
    </div>
  );
};

export default BlogLaTeX;
