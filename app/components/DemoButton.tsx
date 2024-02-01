import useDemoModal from '../hooks/useDemoModal';
import Button from './Button';

interface DemoButtonProps {
  small?: boolean;
}

const DemoButton = ({ small }: DemoButtonProps) => {
  const demoModal = useDemoModal();
  return (
    <div className={small ? 'w-[200px]' : 'w-[300px]'}>
      <Button
        label="Book a Demo"
        onClick={() => {
          demoModal.onOpen();
        }}
        small={small}
      />
    </div>
  );
};

export default DemoButton;
