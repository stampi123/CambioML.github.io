import { useUploadModal } from '@/app/hooks/useUploadModal';
import Button from '../Button';
import { UploadSimple } from '@phosphor-icons/react';
import { usePostHog } from 'posthog-js/react';
interface UploadButtonProps {
  small?: boolean;
  disabled?: boolean;
}

const UploadButton = ({ small, disabled }: UploadButtonProps) => {
  const posthog = usePostHog();
  const uploadModal = useUploadModal();
  return (
    <Button
      label="Upload file"
      onClick={() => {
        posthog.capture('playground.upload.button', { route: '/playground' });
        uploadModal.onOpen();
      }}
      small={small}
      labelIcon={UploadSimple}
      disabled={disabled}
    />
  );
};

export default UploadButton;
