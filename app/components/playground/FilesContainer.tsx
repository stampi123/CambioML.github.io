import UploadButton from './UploadButton';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { FileDashed, SignOut } from '@phosphor-icons/react';
import FileItem from './FileItem';
import Button from '../Button';
import { useAuth0 } from '@auth0/auth0-react';
import { usePostHog } from 'posthog-js/react';

const FilesContainer = () => {
  const { files, loggedIn } = usePlaygroundStore();
  const { logout } = useAuth0();
  const posthog = usePostHog();

  const handleAuth0Logout = () => {
    posthog.capture('playground_logout', { route: '/playground' });
    logout();
  };
  return (
    <div className="h-full w-full  min-h-[400px] grid grid-rows-[50px_1fr_80px_80px]">
      <div className="row-span-1 text-2xl font-semibold pb-10">Files</div>
      <div className="row-span-1 overflow-auto relative box-border">
        {files.length > 0 ? (
          <div className="w-full h-fit flex flex-col items-start justify-center absolute gap-2">
            {files.map((file, i) => (
              <FileItem key={i} pgFile={file} index={i} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileDashed size={40} className="text-neutral-500" />
          </div>
        )}
      </div>

      <div className="row-span-1 h-full flex items-center justify-center pb-2">
        {files.length > 0 && <UploadButton small disabled={!loggedIn} />}
      </div>
      {loggedIn && (
        <div className="border-t-2 pt-4">
          <Button label="Logout" onClick={handleAuth0Logout} small labelIcon={SignOut} />
        </div>
      )}
    </div>
  );
};

export default FilesContainer;
