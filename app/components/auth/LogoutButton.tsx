import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button';
import { SignOut } from '@phosphor-icons/react';

export interface LogoutButtonProps {
  logoutUrl: string;
  disabled?: boolean;
  collapsed?: boolean;
}

const LogoutButton = ({ logoutUrl, disabled, collapsed }: LogoutButtonProps) => {
  const { logout } = useAuth0();

  return (
    <div className="w-full h-full flex">
      <Button
        label={!collapsed ? 'Logout' : ''}
        labelIcon={SignOut}
        onClick={() =>
          logout({
            logoutParams: { returnTo: logoutUrl },
          })
        }
        small
        disabled={disabled}
      />
    </div>
  );
};

export default LogoutButton;
