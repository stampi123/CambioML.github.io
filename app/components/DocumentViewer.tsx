import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';
import Image from 'next/image';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type DocumentViewerProps = {
  fileType: string;
  fileUrl: string;
  fileName: string;
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileType, fileUrl, fileName }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const renderContent = () => {
    if (fileType === 'application/pdf') {
      return (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <div className="h-full">
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </Worker>
      );
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return (
        <div className="h-full w-full border-[1px] rounded-lg">
          <DocViewer documents={[{ uri: fileUrl, fileName: fileName }]} pluginRenderers={DocViewerRenderers} />
        </div>
      );
    } else if (fileType.startsWith('image/')) {
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
    } else {
      return <div>Unsupported file type</div>;
    }
  };

  return <>{renderContent()}</>;
};

export default DocumentViewer;
