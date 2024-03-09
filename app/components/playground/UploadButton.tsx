import { useUploadModal } from '@/app/hooks/useUploadModal';
import Button from '../Button';
import { UploadSimple } from '@phosphor-icons/react';
interface UploadButtonProps {
  small?: boolean;
}

const UploadButton = ({ small }: UploadButtonProps) => {
  const uploadModal = useUploadModal();
  return (
    <div className={small ? 'w-[200px]' : 'w-[300px]'}>
      <Button
        label="Upload file"
        onClick={() => {
          uploadModal.onOpen();
        }}
        small={small}
        labelIcon={UploadSimple}
      />
    </div>
  );
};

export default UploadButton;
