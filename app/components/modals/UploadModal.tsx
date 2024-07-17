'use client';

import { useUploadModal, UploadModalState } from '@/app/hooks/useUploadModal';
import { X, CloudArrowUp, FileArrowUp } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useOutsideClickModal } from '@/app/hooks/useOutsideClickModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import LoginComponent from '../auth/Login';
import Dropzone from '../playground/Dropzone';
import { toast } from 'react-hot-toast';
import PulsingIcon from '../PulsingIcon';
import Button from '../Button';
import { uploadFile } from '@/app/actions/uploadFile';
import { uploadFile as preProdUploadFile } from '@/app/actions/preprod/uploadFile';
import { useProductionContext } from '../playground/ProductionContext';
import { usePostHog } from 'posthog-js/react';

const UploadModal = () => {
  const { apiURL, isProduction } = useProductionContext();
  const uploadModal = useUploadModal();
  const posthog = usePostHog();

  const { loggedIn, filesToUpload, token, clientId, addFilesFormData, addFiles, setFilesToUpload, files } =
    usePlaygroundStore();

  const [showModal, setShowModal] = useState(uploadModal.isOpen);

  const thisRef = useOutsideClickModal(() => {
    handleClose();
  });

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      uploadModal.onClose();
    }, 300);
  }, [uploadModal]);

  const loadPdfFile = async () => {
    return fetch('/uniflow_intro.pdf')
      .then((response) => response.blob())
      .then((blob) => new File([blob], 'uniflow.pdf', { type: 'application/pdf' }))
      .catch((error) => {
        console.error('Error loading PDF file:', error);
      });
  };

  const handleStarterFile = async () => {
    const starterFile = await loadPdfFile();
    if (!starterFile) {
      uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
      toast.error('Error loading starter file. Please try again.');
      return;
    }
    setFilesToUpload([starterFile]);
    uploadModal.setUploadModalState(UploadModalState.UPLOADING);
  };

  useEffect(() => {
    setShowModal(uploadModal.isOpen);
  }, [uploadModal.isOpen]);

  useEffect(() => {
    if (loggedIn && uploadModal.uploadModalState === UploadModalState.LOGIN) {
      uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
    }
  }, [loggedIn, uploadModal.uploadModalState, uploadModal]);

  useEffect(() => {
    if (uploadModal.uploadModalState === UploadModalState.UPLOADING) {
      const uploadPromises = filesToUpload.map((file) => {
        const uploadFunc = isProduction ? uploadFile : preProdUploadFile;
        posthog.capture('playground.upload.start', { route: '/playground', file_type: file.type, module: 'upload' });
        return uploadFunc({
          api_url: apiURL,
          file,
          token,
          clientId,
          addFiles,
          addFilesFormData,
        });
      });

      Promise.all(uploadPromises)
        .then(() => {
          setFilesToUpload([]);
          posthog.capture('playground.upload.success', {
            route: '/playground',
            module: 'upload',
          });
          uploadModal.setUploadModalState(UploadModalState.LOGIN);
          handleClose();
          toast.success('File(s) uploaded successfully!');
        })
        .catch(() => {
          uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
          posthog.capture('playground.upload.error', {
            route: '/playground',
            module: 'upload',
          });
        });
    }
  }, [uploadModal.uploadModalState, handleClose, uploadModal]);

  const generateRandomString = (length = 4) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const clipboardItems = event.clipboardData?.items;
      const filesToUpload: File[] = [];
      const existingFileNames = files.map((file) => {
        if (file.file instanceof File) return file.file.name;
      });
      if (clipboardItems) {
        for (let i = 0; i < clipboardItems.length; i++) {
          const item = clipboardItems[i];
          if (item.type.startsWith('image')) {
            const file = item.getAsFile();
            if (file) {
              let newName;
              do {
                const randomString = generateRandomString();
                newName = `image_${randomString}.${file.type.split('/')[1]}`;
              } while (existingFileNames.includes(newName));

              const newFile = new File([file], newName, { type: file.type });
              filesToUpload.push(newFile);
            }
          }
        }

        if (filesToUpload.length > 0) {
          setFilesToUpload(filesToUpload);
          uploadModal.setUploadModalState(UploadModalState.UPLOADING);
        }
      }
    },
    [setFilesToUpload, uploadModal, files]
  );

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  if (!uploadModal.isOpen) {
    return null;
  }

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
      <div className="relative w-full md:w-4/5 max-w-screen-2xl my-6 mx-auto h-full lg:h-auto md:h-auto">
        <div
          className={`translate duration-300 h-full ${showModal ? 'translate-y-0' : 'translate-y-full'} ${showModal ? 'opacity-100' : 'opacity-0'}`}
        >
          <div
            className="translate h-full md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
            ref={thisRef}
          >
            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
              <button
                onClick={handleClose}
                className="p-1 border=0 hover:opacity-70 transition absolute right-7 hover:bg-neutral-200 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center justify-center h-[600px] lg:h-[90vh] w-auto p-10 max-h-[900px]">
              {uploadModal.uploadModalState === UploadModalState.LOGIN && <LoginComponent />}
              {uploadModal.uploadModalState === UploadModalState.ADD_FILES && (
                <div className="w-full h-full flex flex-col justify-center items-center gap-4 ">
                  <Dropzone />
                  <div className="w-full flex items-center gap-4">
                    <hr className="flex-1 border-t border-gray-300" />
                    <span className="text-gray-500">OR</span>
                    <hr className="flex-1 border-t border-gray-300" />
                  </div>
                  <div className="w-full h-[65px]">
                    <Button label="Upload Starter File" onClick={handleStarterFile} labelIcon={FileArrowUp} small />
                  </div>
                </div>
              )}
              {uploadModal.uploadModalState === UploadModalState.UPLOADING && (
                <div className="flex flex-col justify-center items-center gap-4 text-xl">
                  Uploading
                  <PulsingIcon Icon={CloudArrowUp} size={40} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
