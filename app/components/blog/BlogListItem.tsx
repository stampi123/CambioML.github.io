import React from 'react';
import BlogImage from './BlogImage';
import BlogLink from './BlogLink';

type ListItem = {
  label?: string;
  content: string;
  image?: string;
};

interface BlogListProps {
  items: ListItem[];
  ordered?: boolean;
}

const makeUrlClickable = (text: string) => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return <BlogLink key={index} text={part} url={part} />;
    }
    if (part !== 'https' && part !== 'http') return part;
  });
};

const BlogList = ({ items, ordered }: BlogListProps) => {
  const ListComponent = ordered ? 'ol' : 'ul';
  return (
    // Responsive:
    // - Text size increases on larger screens for better readability
    // - Margin and padding adjust for better spacing on different devices
    <ListComponent
      className={`${ordered ? 'list-decimal' : 'list-disc'} list-inside mb-4 sm:mb-6 text-base sm:text-lg`}
    >
      {items.map((item, index) => (
        <li key={index} className="mb-2 sm:mb-3">
          {item.label && <strong>{item.label}:&nbsp;</strong>}
          {makeUrlClickable(item.content)}
          {item.image && (
            <div className="ml-4 mt-2">
              <BlogImage src={item.image} alt={item.label || item.content} />
            </div>
          )}
        </li>
      ))}
    </ListComponent>
  );
};

export default BlogList;
