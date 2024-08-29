interface BlogParagraphProps {
  children: React.ReactNode;
}

const BlogParagraph = ({ children }: BlogParagraphProps) => {
  return <p className="text-lg mb-6">{children}</p>;
};

export default BlogParagraph;
