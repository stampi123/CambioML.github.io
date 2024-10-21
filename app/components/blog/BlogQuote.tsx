interface BlogQuoteProps {
  name: string;
  quote: string;
}

const BlogQuote = ({ name, quote }: BlogQuoteProps) => {
  return (
    // Responsive:
    // - Padding and margin adjust for better spacing on different devices
    // - Text size increases on larger screens for better readability
    <div className="border-l-4 border-gray-800 pl-3 sm:pl-4 my-3 sm:my-4">
      <p className="text-base sm:text-lg mb-2 sm:mb-3">{name}:</p>
      <blockquote className="italic text-base sm:text-lg">{quote}</blockquote>
    </div>
  );
};

export default BlogQuote;
