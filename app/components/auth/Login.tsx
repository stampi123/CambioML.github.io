import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { deleteAccessStorage, getAccessStorage, setAccessStorage } from '@/app/hooks/useAccessToken';
import toast from 'react-hot-toast';

const ACCESS_TIME = 1; //Access token time in hours

interface LoginResponse {
  credential: string | undefined;
  clientId: string;
  select_by: string;
}

const LoginComponent = () => {
  const { setLoggedIn, setClientId, setToken } = usePlaygroundStore();
  useEffect(() => {
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
  }, [setLoggedIn, setClientId, setToken]);

  const handleLogin = (response: LoginResponse) => {
    setLoggedIn(true);

    if (typeof response.credential === 'string') {
      setToken(response.credential);
      setAccessStorage(response.credential, ACCESS_TIME, 'localStorage');
    }

    setClientId(response.clientId);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
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
    </div>
  );
};

export default LoginComponent;
