import UploadButton from './UploadButton';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { FileDashed } from '@phosphor-icons/react';
import FileItem from './FileItem';
import LogoutButton from '../auth/LogoutButton';

const FilesContainer = () => {
  const { files, loggedIn } = usePlaygroundStore();

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
        <div className="border-t-2 pt-4 w-full flex items-center justify-center">
          <LogoutButton
            logoutUrl={process.env.NEXT_PUBLIC_LOGOUT_URL_PLAYGROUND || 'https://www.cambioml.com/playground'}
          />
        </div>
      )}
    </div>
  );
};

export default FilesContainer;
