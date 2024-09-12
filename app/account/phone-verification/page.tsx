'use client';
import { useState } from 'react';
import InputBasic from '@/app/components/inputs/InputBasic';
import Logo from '@/app/components/navbar/Logo';
import Button from '@/app/components/Button';
import toast from 'react-hot-toast';
import useUserProfile from '@/app/hooks/useUserProfile';

const PhoneVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const { profile, error: profileError, loading: profileLoading } = useUserProfile();

  const handleVerificationCodeChange = (newNumber: string) => {
    const isValidLength = newNumber.length === 6;
    const isOnlyDigits = /^\d+$/.test(newNumber);

    if (!isValidLength || !isOnlyDigits) {
      setError('Verification code must be exactly 6 digits long.');
    } else {
      setError('');
    }
    setVerificationCode(newNumber);
  };

  const handleVerificationClick = async () => {
    if (error.length > 0 || verificationCode.length === 0) return;

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode }),
      });

      if (!response.ok) throw new Error('Failed to verify code');

      const result = await response.json();
      console.log(result);
      toast.success('Verification code accepted!');
    } catch (err) {
      console.error(err);
      toast.error('Verification failed. Please try again.');
    }
  };

  if (profileLoading) return <div>Loading profile...</div>;

  if (profileError) return <div>Error loading profile: {profileError}</div>;

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
        bg-neutral-100
      "
    >
      <div className="w-full min-w-[350px] flex flex-col gap-8 justify-center items-center rounded-xl shadow-xl p-8 bg-white h-full md:h-fit md:w-[350px]">
        <Logo />
        <div className="text-lg text-center">Please verify your phone number {profile.sub}</div>
        <InputBasic
          label="Verification Code"
          value={verificationCode}
          onChange={handleVerificationCodeChange}
          error={error}
        />
        <div className="w-full h-fit">
          <Button
            label="Verify"
            disabled={error.length > 0 || verificationCode.length === 0}
            small
            onClick={handleVerificationClick}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationPage;
