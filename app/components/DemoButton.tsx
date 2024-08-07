import { useRouter } from 'next/navigation';
import Button from './Button';

interface DemoButtonProps {
  small?: boolean;
}

const DemoButton = ({ small }: DemoButtonProps) => {
  const router = useRouter();
  return (
    <div className={small ? 'w-[200px]' : 'w-[300px]'}>
      <Button
        label="Try it for Free"
        onClick={() => {
          router.push('/playground');
        }}
        small={small}
      />
    </div>
  );
};

export default DemoButton;
