export interface SolutionType {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  image: string;
  industries: string[];
  blog: boolean;
  date: Date;
}

export const solutions: SolutionType[] = [
  {
    title: 'Maximizing Long-Text Potential',
    subtitle: 'Strategies for Open-Source LLMs Beyond Token Limits',
    description:
      'Struggling with processing long texts using open-source LLMs? Discover <strong>Uniflow</strong>, a tool that simplifies handling texts beyond token limits. Learn how to effortlessly manage large documents like "War and Peace" and maximize your LLM\'s potential with <strong>Uniflow</strong>.',
    url: 'https://medium.com/@CambioML/maximizing-long-text-potential-strategies-for-open-source-llms-beyond-token-limits-5489242593da',
    image: '/images/solutions/auto-splitter.png',
    industries: [],
    blog: true,
    date: new Date('2024-03-14'),
  },
  {
    title: 'Build Your Own Gmail Spam Filter with LLMs',
    subtitle: 'Any LLM and Privacy Preserved',
    description:
      'Are you annoyed with constantly receiving spam or sales emails? You’re not alone. In this post, we’ll show you how to select an LLM model and create your own Gmail spam filter using <strong>Uniflow</strong>.',
    url: 'https://medium.com/@CambioML/build-your-own-gmail-spam-filter-any-llm-you-choose-and-privacy-preserved-597648aff5fd',
    image: '/images/solutions/gmail-spam-filter.png',
    industries: [],
    blog: true,
    date: new Date('2024-03-11'),
  },
  {
    title: 'Research Paper Evaluator',
    subtitle: 'Build Your Own Research Agent from Research Papers with Uniflow',
    description:
      'Do you want to build an agent so that you can ask it anything about a research paper? In this example, we will show you how use <strong>Uniflow</strong> to extract knowledge from <i>An Observational Study of the Effect of Nike Vaporfly Shoes on Marathon Performance</i>.',
    url: 'https://medium.com/@CambioML/build-your-own-research-agent-from-research-papers-010e88e876f0',
    image: '/images/solutions/nike-research.png',
    industries: ['research-&-development'],
    blog: true,
    date: new Date('2024-03-04'),
  },
  {
    title: '10K Summarizer',
    subtitle: 'Summarize 10K reports with uniflow',
    description:
      'Are you looking to transform dense annual reports (10K) into concise, informative summaries? This guide introduces the use of <strong>Uniflow</strong> to both extract and summarize key information from unstructured annual reports, enabling efficient knowledge discovery and summarization with a Large Language Model (LLM).',
    url: 'https://github.com/CambioML/cambio-cookbook/blob/main/examples/10K_Evaluator/10K_PDF_Summary.ipynb',
    image: '/images/solutions/amazon-10k.png',
    industries: ['finance'],
    blog: false,
    date: new Date('2024-02-28'),
  },
  {
    title: '10K Evaluator',
    subtitle: 'Evaluate 10K reports with uniflow',
    description:
      'Do you want to build an agent so that you can ask it anything about the annual report (10K)? In this example, we will show you how use <strong>Uniflow</strong> and <strong>Pykoi</strong> to extract knowledge from a unstructured annual report (10K) and then finetune an LLM on this knowledge.',
    url: 'https://github.com/CambioML/cambio-cookbook/blob/main/examples/10K_Evaluator/10K_PDF_Evaluator.ipynb',
    image: '/images/solutions/nike-10k.png',
    industries: ['finance'],
    blog: false,
    date: new Date('2024-02-21'),
  },
];
