interface BlogSectionTitleProps {
  title: string;
  secondary?: boolean;
  tertiary?: boolean;
  underline?: boolean;
}

const BlogSectionTitle = ({ title, secondary, tertiary, underline }: BlogSectionTitleProps) => {
  // Responsive:
  // - Text sizes adjust for different heading levels and screen sizes
  // - Margin bottom adjusts for better spacing on different devices
  if (tertiary) {
    return <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 ${underline ? 'underline' : ''}`}>{title}</h3>;
  }
  return (
    <h2
      className={`${secondary ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-semibold mb-3 sm:mb-4 ${underline ? 'underline' : ''}`}
    >
      {title}
    </h2>
  );
};

export default BlogSectionTitle;
