'use client';
import useResultZoomModal from '@/app/hooks/useResultZoomModal';
import LargeModal from './LargeModal';
import { useEffect, useState } from 'react';

const ResultZoomModal = () => {
  const { isOpen, onClose, content } = useResultZoomModal();

  const [renderedContent, setRenderedContent] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    if (typeof content === 'function') {
      setRenderedContent(content());
    } else {
      setRenderedContent(content);
    }
  }, [content]);

  return <LargeModal isOpen={isOpen} onClose={onClose} body={renderedContent || undefined} />;
};

export default ResultZoomModal;
