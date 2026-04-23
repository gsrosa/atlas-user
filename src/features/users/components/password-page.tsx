import { Button, Input } from '@gsrosa/atlas-ui';
import { LockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AccountSectionHeader } from '@/features/users/components/account-section-header';
import { FormField } from '@/features/users/components/form-field';
import { usePasswordForm } from '@/features/users/hooks/use-password-form';

function PasswordPage() {
  const { t } = useTranslation('profile');
  const { form, isSubmitting, onSubmit } = usePasswordForm();
  const { register, formState: { errors } } = form;

  return (
    <div className="animate-account-fade-in-up space-y-10">
      <AccountSectionHeader
        icon={LockIcon}
        title={t('password.title')}
        description={t('password.description')}
      />

      <form onSubmit={onSubmit} className="max-w-md space-y-6">
        <FormField
          label={t('password.current')}
          htmlFor="pwd-current"
          error={errors.currentPassword?.message}
        >
          <Input
            id="pwd-current"
            type="password"
            autoComplete="current-password"
            {...register('currentPassword')}
          />
        </FormField>

        <FormField
          label={t('password.new')}
          htmlFor="pwd-new"
          error={errors.newPassword?.message}
          hint={t('password.hint')}
        >
          <Input
            id="pwd-new"
            type="password"
            autoComplete="new-password"
            {...register('newPassword')}
          />
        </FormField>

        <FormField
          label={t('password.confirm')}
          htmlFor="pwd-confirm"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="pwd-confirm"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          className="rounded-full px-8 font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('password.updating') : t('password.update')}
        </Button>
      </form>
    </div>
  );
}

export { PasswordPage };
export default PasswordPage;
