import UploadButton from './UploadButton';
import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import { FileDashed } from '@phosphor-icons/react';
import FileItem from './FileItem';
import LogoutButton from '../auth/LogoutButton';
import QuotaDisplay from './QuotaDisplay';
import { useProductionContext } from './ProductionContext';

const FilesContainer = () => {
  const { files, loggedIn } = usePlaygroundStore();
  const { isProduction } = useProductionContext();

  const logoutUrl = isProduction
    ? process.env.NEXT_PUBLIC_LOGOUT_URL_PLAYGROUND
    : process.env.NEXT_PUBLIC_LOGOUT_URL_PLAYGROUND_PRE_PROD;

  return (
    <div className="h-full w-full  min-h-[400px] grid grid-rows-[50px_1fr_70px_70px_70px]">
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

      <div className="row-span-1 h-full flex items-center justify-center py-2">
        {files.length > 0 && <UploadButton small disabled={!loggedIn} />}
      </div>
      {loggedIn && (
        <>
          <div className="row-span-1 h-full border-y-2 py-2 w-full flex flex-col gap-2 items-center justify-center">
            <LogoutButton logoutUrl={logoutUrl || 'https://www.cambioml.com/playground'} />
          </div>
          <QuotaDisplay />
        </>
      )}
    </div>
  );
};

export default FilesContainer;
