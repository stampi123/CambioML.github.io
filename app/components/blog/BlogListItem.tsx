type ListItem = {
  label?: string;
  content: string;
};

interface BlogListProps {
  items: ListItem[];
}

const BlogList = ({ items }: BlogListProps) => {
  return (
    <ul className="list-disc list-inside mb-6 text-lg">
      {items.map((item, index) => (
        <li key={index}>
          {item.label && (
            <>
              <strong>{item.label}:</strong>&nbsp;
            </>
          )}
          {item.content}
        </li>
      ))}
    </ul>
  );
};

export default BlogList;
