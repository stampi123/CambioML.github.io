interface BlogLinkProps {
  text: string;
  url: string;
}

const BlogLink = ({ text, url }: BlogLinkProps) => {
  return (
    <>
      &nbsp;
      {/* Responsive:
          - Text color changes on hover for better interaction on desktop
          - Underline provides clear indication of link on all devices */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-500 hover:text-neutral-800 underline"
      >
        {text}
      </a>
    </>
  );
};

export default BlogLink;
