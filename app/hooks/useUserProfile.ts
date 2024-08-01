import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
  email_verified: boolean;
  sub: string;
  picture: string;
}

const useUserProfile = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        return; // Exit if the user is not authenticated
      }

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
            scope: 'openid profile email',
          },
        });
        setToken(accessToken);
        const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const profileData: UserProfile = await response.json();
        setProfile(profileData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchUserProfile();
  }, [getAccessTokenSilently, isAuthenticated]);

  return { profile, error, loading: isLoading || (isAuthenticated && !profile && !error), token };
};

export default useUserProfile;
