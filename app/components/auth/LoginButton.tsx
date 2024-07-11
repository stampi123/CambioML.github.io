import { SignIn } from '@phosphor-icons/react/dist/ssr';
import Button from '../Button';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleAuth0Login = () => {
    // posthog.capture('playground_login', { route: '/playground' });
    loginWithRedirect({
      authorizationParams: {
        scope: 'openid profile email',
      },
    });
  };
  return (
    <div className="w-full max-w-[500px]">
      <Button label="Login" small onClick={handleAuth0Login} labelIcon={SignIn} />
    </div>
  );
};

export default LoginButton;
