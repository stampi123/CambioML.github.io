import Container from '../Container';
import Heading from '../Heading';
import ProductHunt from '../navbar/ProductHunt';
import AiTools from '../navbar/AiTools';

const capabilities = [
  {
    description:
      'Privacy Protection: Activate the "Remove Private Information" feature, and AnyParser will automatically redact P.I.I. during the document extraction.',
  },
  {
    description: 'You can instruct the model to include or omit page numbers, headers, footers, figures, charts, etc.',
  },
  {
    description:
      'AnyParser doesn’t just extract text and tables, it also retrieves figures, charts, and footnotes packed with vital information 2X faster and 5X more cost efficient',
  },
  {
    description:
      'Bid farewell to jumbled tables and chaotic layouts that plague traditional OCR-based models with a 2X more precision and 2.5X more recall than industry average.',
  },
];

interface CapabilityCardProps {
  description: string;
}

const CapabilityCard = ({ description }: CapabilityCardProps) => {
  return (
    <div className="flex flex-col items-center justify-start w-full">
      <div className="mt-6 text-lg text-center w-full">{description}</div>
    </div>
  );
};

const Capabilities = () => {
  return (
    <div className="h-fit w-full py-20">
      <Container styles="relative z-10 h-fit lg:h-[480px]">
        <div className="w-full h-full flex flex-col items-center justify-start px-10">
          <Heading title="AnyParser's Capabilities" center />
          <div className="pt-20 gap-20 grid grid-cols-2 lg:grid-cols-4 items-start justify-items-center w-full">
            {capabilities.map((capability, i) => (
              <CapabilityCard key={i} {...capability} />
            ))}
          </div>
          <div className="my-16">
            <div className="flex space-x-4">
              <ProductHunt />
              <AiTools />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default Capabilities;
