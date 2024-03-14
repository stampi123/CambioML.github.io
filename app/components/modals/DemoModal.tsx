'use client';

import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useDemoModal from '@/app/hooks/useDemoModal';
import FormModal from './FormModal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

const DemoModal = () => {
  const DemoModal = useDemoModal();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';

    const templateParams = {
      from_name: data.name,
      to_name: 'Cambio',
      email: data.email,
      message: data.message,
    };

    try {
      setIsLoading(true);
      await emailjs.send(serviceId, templateId, templateParams);
      toast.success('Sent!');
      DemoModal.onClose();
    } catch (error) {
      toast.error('Contact failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Book a Demo" subtitle="" center />
      <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required />
      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
      <Input id="message" label="Message" disabled={isLoading} register={register} errors={errors} type="textarea" />
    </div>
  );

  return (
    <FormModal
      disabled={isLoading}
      isOpen={DemoModal.isOpen}
      title=""
      actionLabel="Submit"
      onClose={DemoModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default DemoModal;
