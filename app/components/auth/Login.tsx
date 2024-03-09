import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { getAccessCookie, setAccessCookie } from '@/app/hooks/useAccessToken';
import toast from 'react-hot-toast';
interface LoginResponse {
  credential: string | undefined;
  clientId: string;
  select_by: string;
}

const LoginComponent = () => {
  const { setLoggedIn, setClientId, setToken } = usePlaygroundStore();
  useEffect(() => {
    const accessToken = getAccessCookie();
    if (accessToken) {
      setLoggedIn(true);
      setClientId(process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID || '');
      setToken(accessToken);
    }
  }, []);

  const handleLogin = (response: LoginResponse) => {
    setLoggedIn(true);

    if (typeof response.credential === 'string') {
      setToken(response.credential);
      setAccessCookie(response.credential);
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
