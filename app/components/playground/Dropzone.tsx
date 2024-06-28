import { useDropzone } from 'react-dropzone';
import { CloudArrowUp } from '@phosphor-icons/react';
import { useCallback } from 'react';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { useUploadModal, UploadModalState } from '@/app/hooks/useUploadModal';
import toast from 'react-hot-toast';

const DropzoneContainerClass =
  'border-2 bg-gray-100 border-dashed border-gray-300 h-[50vh] rounded-md text-center cursor-pointer transition duration-300 ease-in-out flex flex-col items-center justify-center hover:border-neutral-500 w-full';

const iconContainerClasses = 'flex items-center justify-center text-3xl mb-4';
const allowedTypes = [
  'application/pdf',
  'text/html',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const Dropzone = () => {
  const uploadModal = useUploadModal();
  const { setFilesToUpload } = usePlaygroundStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        if (file) {
          if (!allowedTypes.includes(file.type)) {
            toast.error(`Error processing ${file.name}: File type is not supported.`);
            uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
            return;
          }
          if (file.size > 10 * 1024 * 1024) {
            toast.error(`Error processing ${file.name}: Size exceeds the limit of 10 MB. Please try again.`);
            uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
            return;
          }
        }
      }
      setFilesToUpload(acceptedFiles);
      uploadModal.setUploadModalState(UploadModalState.UPLOADING);
    },
    [setFilesToUpload, uploadModal]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={DropzoneContainerClass} {...getRootProps()}>
      <div className={iconContainerClasses}>{<CloudArrowUp size={32} />}</div>
      <input {...getInputProps()} className="hidden" />
      <p className="mt-2">
        {isDragActive ? 'Drop files here' : 'Drag and drop a single file here, or click to select a file'}
      </p>
      <p className="text-sm text-gray-500">PDF, TXT, HTML, XLSX, PNG, JPG, and JPEG files only</p>
      <p className="text-sm text-gray-500">Please do not upload any sensitive information.</p>
      <p className="text-sm text-gray-500">Max 10 MB</p>
    </div>
  );
};

export default Dropzone;
