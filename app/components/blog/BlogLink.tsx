interface BlogLinkProps {
  text: string;
  url: string;
}

const BlogLink = ({ text, url }: BlogLinkProps) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
      {text}
    </a>
  );
};

export default BlogLink;
