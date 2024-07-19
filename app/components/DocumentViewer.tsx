import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Image from 'next/image';

type DocumentViewerProps = {
  fileType: string;
  fileUrl: string;
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileType, fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (fileType === 'application/pdf') {
    return (
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <div className="h-full">
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
      </Worker>
    );
  }

  return (
    <div className="h-full w-full border-[1px] rounded-lg">
      <Image
        alt="Document"
        src={fileUrl}
        width={0}
        height={0}
        sizes="100%"
        style={{ width: '100%', height: 'auto' }}
        className="rounded-lg"
      />
    </div>
  );
};

export default DocumentViewer;
