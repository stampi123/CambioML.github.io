interface BlogParagraphProps {
  children: React.ReactNode;
  bold?: boolean;
}

const BlogParagraph = ({ children, bold = false }: BlogParagraphProps) => {
  return <p className={`text-lg mb-6 ${bold ? 'font-bold' : ''}`}>{children}</p>;
};

export default BlogParagraph;
