'use client';

import { useUploadModal, UploadModalState } from '@/app/hooks/useUploadModal';
import { X, CloudArrowUp } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useOutsideClickModal } from '@/app/hooks/useOutsideClickModal';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import LoginComponent from '../auth/Login';
import Dropzone from '../playground/Dropzone';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { PresignedResponse } from '@/app/types/PlaygroundTypes';
import PulsingIcon from '../PulsingIcon';
import InputBasic from '../inputs/InputBasic';
import Button from '../Button';

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const [htmlInputValue, setHtmlInputValue] = useState('');
  const [htmlInputError, setHtmlInputError] = useState('');

  const handleHtmlInputChange = (value: string) => {
    if (isValidUrl(value)) {
      setHtmlInputError('');
    } else {
      setHtmlInputError('Invalid URL');
    }
    setHtmlInputValue(value);
  };

  const isValidUrl = (url: string) => {
    const urlPattern = /^(http|https):\/\/(www\.)?[^\s"]+$/;
    return urlPattern.test(url);
  };

  const handleHtmlAdd = () => {
    if (htmlInputError.length === 0) {
      addHTMLFile(htmlInputValue);
      setHtmlInputValue('');
      toast.success(`Added ${htmlInputValue}`);
      if (selectedFileIndex === null) setSelectedFileIndex(0);
      handleClose();
    } else {
      toast.error('Invalid HTML URL');
    }
  };

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      uploadModal.onClose();
    }, 300);
  }, [uploadModal]);

  const {
    loggedIn,
    filesToUpload,
    token,
    clientId,
    addFilesFormData,
    addFiles,
    addHTMLFile,
    setSelectedFileIndex,
    setFilesToUpload,
    selectedFileIndex,
  } = usePlaygroundStore();
  const thisRef = useOutsideClickModal(() => {
    handleClose();
  });

  const [showModal, setShowModal] = useState(uploadModal.isOpen);

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
      const uploadPromises = filesToUpload.map((file) => uploadFile(file));

      Promise.all(uploadPromises)
        .then(() => {
          if (selectedFileIndex === null) setSelectedFileIndex(0);
          setFilesToUpload([]);
          uploadModal.setUploadModalState(UploadModalState.LOGIN);
          handleClose();
          toast.success('File(s) uploaded successfully!');
        })
        .catch(() => {
          uploadModal.setUploadModalState(UploadModalState.ADD_FILES);
          return;
        });
    }
  }, [uploadModal.uploadModalState, handleClose, uploadModal]);

  const uploadFile = async (file: File) => {
    const file_name = file.name;
    const GetPresignedS3UrlAPI: string = `${process.env.NEXT_PUBLIC_PLAYGROUND_API_URL}/upload?token=${token}&client_id=${clientId}&file_name=${file_name}&job_type=file_extraction`;
    await axios
      .get<PresignedResponse>(GetPresignedS3UrlAPI)
      .then((response) => {
        const data = response.data as PresignedResponse;
        addFilesFormData(data);
        addFiles(file);
      })
      .catch((error) => {
        toast.error(`Error uploading file: ${file.name}. Please try again.`);
        throw error;
      });
  };

  if (!uploadModal.isOpen) {
    return null;
  }

  return (
    <div
      className="
        justify-center
        items-center
        flex
        overflow-x-hidden
        overflow-y-auto
        fixed
        inset-0
        z-50
        outline-none
        focus:outline-none
        bg-neutral-800/70
      "
    >
      <div
        className="
          relative
          w-full
          md:w-4/5
          max-w-screen-2xl
          my-6
          mx-auto
          h-full
          lg:h-auto
          md:h-auto
        "
      >
        <div
          className={`
          translate
          duration-300
          h-full
          h-full
          ${showModal ? 'translate-y-0' : 'translate-y-full'}
          ${showModal ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div
            className="
              translate
              h-full
              md:h-auto
              border-0
              rounded-lg
              shadow-lg
              relative
              flex
              flex-col
              w-full
              bg-white
              outline-none
              focus:outline-none
            "
            ref={thisRef}
          >
            <div
              className="
                flex
                items-center
                p-6
                rounded-t
                justify-center
                relative
                border-b-[1px]
              "
            >
              <button
                onClick={handleClose}
                className="
                  p-1
                  border=0
                  hover:opacity-70
                  transition
                  absolute
                  right-7
                  hover:bg-neutral-200
                  rounded-full
                "
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center justify-center h-auto lg:h-[90vh] w-auto p-10 max-h-[800px]">
              {uploadModal.uploadModalState === UploadModalState.LOGIN && <LoginComponent />}
              {uploadModal.uploadModalState === UploadModalState.ADD_FILES && (
                <div className="w-full h-full flex flex-col justify-center items-center gap-4 ">
                  <div className="w-full grid grid-cols-[1fr_125px] gap-4 pt-4">
                    <InputBasic
                      label="URL"
                      value={htmlInputValue}
                      onChange={handleHtmlInputChange}
                      error={htmlInputError}
                    />
                    <Button
                      label="Add"
                      small
                      onClick={handleHtmlAdd}
                      disabled={htmlInputValue.length === 0 || htmlInputError.length > 0}
                    />
                  </div>
                  <div className="w-full flex items-center gap-4">
                    <hr className="flex-1 border-t border-gray-300" />
                    <span className="text-gray-500">OR</span>
                    <hr className="flex-1 border-t border-gray-300" />
                  </div>{' '}
                  <Dropzone />
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
