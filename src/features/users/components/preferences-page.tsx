import React from 'react';

import { TravelerProfileFormPage, TravelerProfileSettingsPage } from '@/features/traveler-profile';

function PreferencesPage() {
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    const done = () => setIsEditing(false);
    window.addEventListener('atlas:traveler-profile-updated', done);
    return () => window.removeEventListener('atlas:traveler-profile-updated', done);
  }, []);

  if (isEditing) return <TravelerProfileFormPage />;
  return <TravelerProfileSettingsPage onEdit={() => setIsEditing(true)} />;
}

export { PreferencesPage };
export default PreferencesPage;
