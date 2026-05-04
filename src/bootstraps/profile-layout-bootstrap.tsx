import { Toaster } from 'sonner';

import { ProfileLayout } from '@/features/users';

import { TrpcProvider } from '@/providers/trpc-provider';

import '@/lib/i18n';
import '@/styles/federation.css';

const ProfileLayoutBootstrap = () => {
  return (
    <TrpcProvider>
      <ProfileLayout />
      <Toaster richColors position="top-center" theme="dark" />
    </TrpcProvider>
  );
};

export default ProfileLayoutBootstrap;
