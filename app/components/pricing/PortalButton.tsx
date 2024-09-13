import useUserProfile from '@/app/hooks/useUserProfile';
import { useState } from 'react';
import Button from '../Button';

const PortalButton = () => {
  const { profile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);

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
  return <Button label="Manage Subscription" small disabled={isLoading} onClick={handleSubmit} />;
};

export default PortalButton;
