'use client';
import React from 'react';
import useCompareModal from '@/app/hooks/useCompareModal';
import DocumentViewer from '../DocumentViewer';
import FullscreenModal from './FullscreenModal';
// import LargeModal from './LargeModal';

const CompareModal = () => {
  const { isOpen, onClose, file, content } = useCompareModal();
  let bodyContent = <div className="w-full h-full">No File</div>;

  if (file)
    bodyContent = (
      <div className="w-full h-[92vh] grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-full overflow-scroll">
          <DocumentViewer fileType={file?.type} fileUrl={URL.createObjectURL(file)} fileName={file.name} />
        </div>
        <div className="overflow-auto relative w-full h-full">{content}</div>
      </div>
    );

  return <FullscreenModal isOpen={isOpen} onClose={onClose} body={bodyContent} />;
};

export default CompareModal;
