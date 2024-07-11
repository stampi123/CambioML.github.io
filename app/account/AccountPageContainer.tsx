'use client';
import { Icon, Key, UserCircle } from '@phosphor-icons/react';
import Container from '../components/Container';
import Heading from '../components/Heading';
import LoginButton from '../components/auth/LoginButton';
import LogoutButton from '../components/auth/LogoutButton';
import PageHero from '../components/hero/PageHero';
import useUserProfile from '../hooks/useUserProfile';
import Image from 'next/image';
import { imgPrefix } from '../hooks/useImgPrefix';

interface LoadingComponentProps {
  icon: Icon;
}

const LoadingComponent = ({ icon: Icon }: LoadingComponentProps) => {
  return (
    <div className="w-full h-full bg-neutral-100 rounded-xl animate-pulse flex items-center justify-center text-neutral-600">
      <Icon size={48} />
    </div>
  );
};

const AccountPageContainer = () => {
  const { profile, error, loading } = useUserProfile();

  return (
    <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
      <PageHero title="Account" short />
      <Container styles="h-[50vh] min-h-[1000px] py-10 w-[850px]">
        <div className="w-full h-full flex flex-col gap-12">
          <div>
            <Heading title="Profile" />
            <div className="w-full h-[275px] flex flex-col items-center justify-center">
              {loading && <LoadingComponent icon={UserCircle} />}
              {!loading && error && (
                <>
                  <div>Error loading user profile: {error}</div>
                  Please try again.
                  <LoginButton />
                </>
              )}
              {!loading && !error && !profile && (
                <>
                  <div className="text-2xl text-neutral-700">Please log in.</div>
                  <LoginButton />
                </>
              )}
              {!loading && !error && profile && (
                <div className="w-full h-full flex flex-col items-center justify-between gap-8">
                  <div className="w-full flex flex-col items-center justify-center gap-4">
                    <Image
                      src={`${profile.picture || imgPrefix + '/images/default-profile.png'}`}
                      alt="Profile Picture"
                      width={150}
                      height={150}
                      className="rounded-full"
                    />
                    <h1>Welcome, {profile.name}!</h1>
                  </div>
                  <div className="w-full h-[50px] flex items-center justify-center">
                    <LogoutButton
                      logoutUrl={process.env.NEXT_PUBLIC_LOGOUT_URL_ACCOUNT || 'https://www.cambioml.com/account'}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <Heading title="API Keys" />
            <div className="w-full h-[300px] flex flex-col items-center gap-8">
              {loading && <LoadingComponent icon={Key} />}
              {!loading && error && (
                <>
                  <div>Error loading user profile: {error}</div>
                </>
              )}
              {!loading && !error && !profile && (
                <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center">
                  <Key size={48} />
                </div>
              )}
              {!loading && !error && profile && (
                <div className="w-full h-full flex flex-col items-start justify-between gap-8">
                  Generate and copy your API keys.
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AccountPageContainer;
