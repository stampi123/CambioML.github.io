import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { deleteAccessStorage, getAccessStorage } from '@/app/hooks/useAccessToken';
import toast from 'react-hot-toast';
import { useCallback, useEffect } from 'react';
import Button from '../Button';
import { SignIn, UserCircle } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import { useAuth0 } from '@auth0/auth0-react';
import { useProductionContext } from '../playground/ProductionContext';
import { usePostHog } from 'posthog-js/react';

const LoginComponent = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently, logout } = useAuth0();
  const { auth0Enabled } = useProductionContext();
  const posthog = usePostHog();
  const { loggedIn, setLoggedIn, setClientId, setToken, setUserId } = usePlaygroundStore();

  useEffect(() => {
    if (!auth0Enabled) {
      const accessToken = getAccessStorage();
      if (accessToken) {
        setLoggedIn(true);
        setClientId(process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID || '');
        setToken(accessToken);
      } else {
        setLoggedIn(false);
        setClientId('');
        setToken('');
        deleteAccessStorage();
      }
    }
  }, [setLoggedIn, setClientId, setToken]);

  useEffect(() => {
    if (!isLoading && auth0Enabled) {
      if (isAuthenticated) {
        getAccessToken();
        setLoggedIn(true);
        setClientId(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '');
        fetchUserProfile();
      } else if (loggedIn) {
        handleLogout();
      }
    }
  }, [isAuthenticated, isLoading, auth0Enabled, loggedIn]);

  const getAccessToken = useCallback(async () => {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: 'openid profile email',
        },
      });
      setToken(accessToken);
      setLoggedIn(true);
      setClientId(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '');
    } catch (e) {
      console.log(e);
      toast.error('Failed to get access token');
      handleLogout();
    }
  }, [getAccessTokenSilently, setToken, setLoggedIn, setClientId]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const profile = await response.json();
      setUserId(profile.sub);
      if (profile.email) {
        posthog.identify(profile.email);
      }
    } catch (e) {
      console.log('Failed to fetch user profile', e);
    }
  }, [getAccessTokenSilently, posthog]);

  const handleLogout = () => {
    console.log('logging out');
    setToken('');
    setLoggedIn(false);
    setClientId('');
    setToken('');
    logout();
  };

  const handleAuth0Login = () => {
    posthog.capture('playground.login.button', { route: '/playground' });
    loginWithRedirect({
      authorizationParams: {
        scope: 'openid profile email',
      },
    });
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      {isLoading ? (
        <PulsingIcon Icon={UserCircle} size={48} />
      ) : (
        <>
          <UserCircle size={80} className="text-neutral-700" />
          <div className="w-full max-w-[500px]">
            <Button label="Login" small onClick={handleAuth0Login} labelIcon={SignIn} />
          </div>
        </>
      )}
    </div>
  );
};

export default LoginComponent;
