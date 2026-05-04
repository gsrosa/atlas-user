import React from 'react';

import { UserPreferencesFormPage } from './user-preferences-form-page';
import { UserPreferencesSettingsPage } from './user-preferences-settings-page';

function UserPreferencesPage() {
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    const done = () => setIsEditing(false);
    window.addEventListener('nexploring:traveler-profile-updated', done);
    return () =>
      window.removeEventListener('nexploring:traveler-profile-updated', done);
  }, []);

  if (isEditing) return <UserPreferencesFormPage />;
  return <UserPreferencesSettingsPage onEdit={() => setIsEditing(true)} />;
}

export { UserPreferencesPage };
export default UserPreferencesPage;
