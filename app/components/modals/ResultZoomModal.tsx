'use client';

import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import LargeModal from './LargeModal';

const ResultZoomModal = () => {
  const ResultZoomModal = useResultZoomModal();

  const bodyContent = (
    <div className="flex items-center justify-center w-auto h-[60vh] min-h-[500px] overflow-y-auto">
      {ResultZoomModal.content}
    </div>
  );

  return <LargeModal isOpen={ResultZoomModal.isOpen} onClose={ResultZoomModal.onClose} body={bodyContent} />;
};

export default ResultZoomModal;
