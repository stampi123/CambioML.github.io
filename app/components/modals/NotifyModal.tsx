'use client';

import { useEffect, useState } from "react";
import {
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form";
import useNotifyModal from "@/app/hooks/useNotifyModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import emailjs from "@emailjs/browser";


const NotifyModal = () => {
  const notifyModal = useNotifyModal();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "")
  }, []);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";

    const templateParams = {
      from_name: data.name,
      to_name: 'Cambio',
      email: data.email,
      message: data.message,
    };

    try {
      setIsLoading(true);
      await emailjs.send(serviceId, templateId, templateParams)
      toast.success("Sent!")
      notifyModal.onClose();
    } catch (error) {
      toast.error("Contact failed. Please try again.")
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }


  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Contact Us"
        subtitle="Get notified when we launch!"
        center
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="message"
        label="Message"
        disabled={isLoading}
        register={register}
        errors={errors}
        type="textarea"
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={notifyModal.isOpen}
      title=""
      actionLabel="Submit"
      onClose={notifyModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  )
};

export default NotifyModal;