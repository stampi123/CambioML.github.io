import Container from '../Container';
import Heading from '../Heading';

const testimonials = [
  {
    name: 'Ethan Zheng - Cofounder @ JobRight.ai',
    quote:
      '“As a leading AI-powered job search platform, Jobright prioritizes top-tier resume parsing accuracy and low latency. AnyParser not only outperformed 10+ other parsers based on our benchmarks, but also stood out as the fastest multi-model LLM solution, all while maintaining exceptional performance.”',
  },
  {
    name: 'Jon Conradt - Principle Scientist @ AWS',
    quote:
      '“AnyParser’s advanced multimodal AI delivers where other approaches fail. Complex documents require this fusion of sight and language.“',
  },
  {
    name: 'Cass - Senior Scientist @ Amazon Machine Learning University',
    quote:
      '“I’m used to research solutions all the time to offer to my students always SOTA content from diverse AI domains. Most of my students are ML practitioners that build real solutions and I’m excited I’ve found AnyParser as a great tool that helps improve retrieval accuracy in document parsing, while preserving the delicate balance between security, costs, and operational efficiency. A great and innovative tool to implement document parsing pipeline!”',
  },
  {
    name: 'Yunfei - Senior Solution Architect @ AWS',
    quote:
      "“I am impressed by CambioML's innovation in the space of AI and LLM, including the novel methodologies of synthetic data generation, retriever model fine-tuning in RAG, and their open-source products out of those innovations.”",
  },
  {
    name: 'Richard (CEO @ Epsilla)',
    quote: '“We had tried all the pdf extraction tool and CambioML gave us the most accurate results.”',
  },
  {
    name: 'Jamal (CEO @ Xtra)',
    quote: "“It's far better than other tools! Our data analysts are able to triple their outputs.”",
  },
  {
    name: 'Steve Cooper (Cofounder @ AI Ticker Chat)',
    quote:
      '“I have validated the quality of AnyParser goes far beyond traditional OCR tools like Langchain / Unstructured. Looking forward to using this in our future projects.”',
  },
];

const Testimonials = () => {
  return (
    <div className="h-full w-full pt-20 bg-[#D1A3A4]">
      <Container styles="relative z-10 h-fit overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-start px-10 py-20 relative">
          <Heading title="Testimonial" center />
          <div className="relative h-[400px] w-full overflow-hidden border-gray-600">
            <div className="absolute top-0 left-0 w-[50px] lg:w-[100px] h-full bg-gradient-to-r from-[#D1A3A4] to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[50px] lg:w-[100px] lg:w-[150px] h-full bg-gradient-to-l from-[#D1A3A4] to-transparent z-20 pointer-events-none" />
            <div className="flex absolute left-0 justify-start items-center h-full animate-slide hover:pause">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 h-fit w-[500px] mx-4 bg-white shadow-lg rounded-lg p-6 text-center rounded-xl"
                >
                  <p className="text-lg italic text-gray-700">{testimonial.quote}</p>
                  <p className="mt-4 font-bold text-gray-900">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Testimonials;
