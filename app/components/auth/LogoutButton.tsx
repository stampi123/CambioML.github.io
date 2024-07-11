import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button';
import { SignOut } from '@phosphor-icons/react';
// import useUserProfile from '@/app/hooks/useUserProfile';

interface LogoutButtonProps {
  logoutUrl: string;
}

const LogoutButton = ({ logoutUrl }: LogoutButtonProps) => {
  const { logout } = useAuth0();
  // const { profile } = useUserProfile();
  // const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;

  return (
    <div className="w-full h-full flex max-w-[500px]">
      <Button
        label="Logout"
        labelIcon={SignOut}
        onClick={() =>
          logout({
            logoutParams: { returnTo: logoutUrl },
          })
        }
        small
      />
    </div>
  );
};

export default LogoutButton;
