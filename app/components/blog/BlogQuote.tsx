interface BlogQuoteProps {
  name: string;
  quote: string;
}

const BlogQuote = ({ name, quote }: BlogQuoteProps) => {
  return (
    <div className="border-l-4 border-gray-800 pl-4 my-4">
      <p className="text-lg mb-6">{name}:</p>
      <blockquote className="italic text-lg">{quote}</blockquote>
    </div>
  );
};

export default BlogQuote;
