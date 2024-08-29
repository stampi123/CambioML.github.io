interface BlogSectionTitleProps {
  title: string;
}

const BlogSectionTitle = ({ title }: BlogSectionTitleProps) => {
  return <h2 className="text-2xl font-semibold mb-4">{title}</h2>;
};

export default BlogSectionTitle;
