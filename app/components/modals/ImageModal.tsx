'use client';

import useImageModal from '@/app/hooks/useImageModal';
import { X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

const ImageModal = () => {
  const imageModal = useImageModal();

  const [showModal, setShowModal] = useState(imageModal.isOpen);

  useEffect(() => {
    setShowModal(imageModal.isOpen);
  }, [imageModal.isOpen]);

  const handleClose = () => {
    setTimeout(() => {
      imageModal.onClose();
    }, 300);
  };

  if (!imageModal.isOpen) {
    return null;
  }

  return (
    <>
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
                  right-9
                "
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center justify-center h-auto lg:h-[600px] xl:h-[800px] w-auto">
                <img src={imageModal.image} alt="modal" className="h-auto lg:h-auto w-auto lg:w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageModal;
