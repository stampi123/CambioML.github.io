import { useRouter } from 'next/navigation';
import Button from '../Button';
import { useState } from 'react';
import useUserProfile from '@/app/hooks/useUserProfile';

const SuccessDisplay = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useUserProfile();

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(profile);
    if (!profile) return;
    console.log(profile);

    const userId = profile.sub;
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRIPE_SESSION_URL}payment/create-portal-session`, {
        method: 'POST',
        headers: {
          'x-api-key': 'L6pzVkMLkJ1TqnnODeu8L3Ia6bw4vt5k44kabSuc',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          returnUrl: 'http://localhost:3000/account',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      window.location.href = result.url;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="h-[80vh] w-full flex flex-col gap-5 items-center justify-center">
      <h1 className="text-6xl font-semibold">Successfully Subscribed!</h1>
      <h2 className="text-3xl text-neutral-500 pb-10">{`You're all set to start parsing your data 🚀`}</h2>
      <div className="w-fit flex flex-row items-center justify-center gap-10">
        <div className="w-[300px]">
          <Button label="Manage billing information" small disabled={isLoading} onClick={handleSubmit} />
        </div>
        <div className="w-[300px]">
          <Button label="Go to Account" onClick={() => router.push('/account')} small disabled={isLoading} outline />
        </div>
      </div>
    </div>
  );
};

export default SuccessDisplay;
