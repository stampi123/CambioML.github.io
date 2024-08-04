import React from 'react';

const ProductHunt = () => {
  return (
    <div className="min-w-[100px]">
      <a
        href="https://www.producthunt.com/posts/anyparser?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-anyparser"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=471331&theme=light&period=weekly&topic_id=94"
          alt="AnyParser - Accurate&#0044;&#0032;private&#0032;and&#0032;configurable&#0032;document&#0032;retrieval&#0032;LLM | Product Hunt"
          style={{ width: '250px', height: '54px' }}
          width="250"
          height="54"
        />
      </a>
    </div>
  );
};

export default ProductHunt;
