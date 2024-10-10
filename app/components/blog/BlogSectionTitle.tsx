interface BlogSectionTitleProps {
  title: string;
  secondary?: boolean;
  tertiary?: boolean;
  underline?: boolean;
}

const BlogSectionTitle = ({ title, secondary, tertiary, underline }: BlogSectionTitleProps) => {
  if (tertiary) {
    return <h3 className={`text-lg font-semibold mb-4 ${underline && 'underline'}`}>{title}</h3>;
  }
  return (
    <h2 className={`${secondary ? 'text-xl' : 'text-2xl'} font-semibold mb-4 ${underline && 'underline'}`}>{title}</h2>
  );
};

export default BlogSectionTitle;
