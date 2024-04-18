import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import config from '../playground/config';
import { deleteAccessStorage, getAccessStorage, setAccessStorage } from '@/app/hooks/useAccessToken';
import toast from 'react-hot-toast';
import { useCallback, useEffect } from 'react';
import Button from '../Button';
import { SignIn, UserCircle } from '@phosphor-icons/react';
import PulsingIcon from '../PulsingIcon';
import { useAuth0 } from '@auth0/auth0-react';

const ACCESS_TIME = 1; //Access token time in hours

interface LoginResponse {
  credential: string | undefined;
  clientId: string;
  select_by: string;
}

const LoginComponent = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently, logout } = useAuth0();

  const { loggedIn, setLoggedIn, setClientId, setToken } = usePlaygroundStore();
  useEffect(() => {
    if (!config.AUTH0_ENABLED) {
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
    if (!isLoading && config.AUTH0_ENABLED) {
      if (isAuthenticated) {
        getAccessToken();
        setLoggedIn(true);
        setClientId(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '');
      } else if (loggedIn) {
        handleLogout();
      }
    }
  }, [isAuthenticated]);

  const handleLogin = (response: LoginResponse) => {
    setLoggedIn(true);

    if (typeof response.credential === 'string') {
      setToken(response.credential);
      setAccessStorage(response.credential, ACCESS_TIME, 'localStorage');
    }

    setClientId(response.clientId);
  };

  const getAccessToken = useCallback(async () => {
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: 'read:current_user',
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
  }, [getAccessTokenSilently, setToken]);

  const handleLogout = () => {
    console.log('logging out');
    setToken('');
    setLoggedIn(false);
    setClientId('');
    setToken('');
    logout();
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      {config.AUTH0_ENABLED ? (
        <>
          {isLoading ? (
            <PulsingIcon Icon={UserCircle} size={48} />
          ) : (
            <>
              {isAuthenticated && user ? (
                <>
                  <div>
                    <img src={user.picture} alt={user.name} />
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                  </div>
                  <Button label="Logout" small onClick={() => logout()} />
                </>
              ) : (
                <>
                  <UserCircle size={80} className="text-neutral-700" />
                  <div className="w-full max-w-[500px]">
                    <Button label="Login" small onClick={() => loginWithRedirect()} labelIcon={SignIn} />
                  </div>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div>Please login to use the Playground.</div>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID || ''}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleLogin(credentialResponse as LoginResponse);
              }}
              onError={() => {
                toast.error('Log in failed. Please check your Google account.');
              }}
            />
          </GoogleOAuthProvider>
        </>
      )}
    </div>
  );
};

export default LoginComponent;
