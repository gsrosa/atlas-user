import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@gsrosa/nexploring-ui';
import { UserIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useProfileForm } from '@/features/profile/hooks/use-profile-form';
import { AccountSectionHeader } from '@/features/users/components/account-section-header';
import { FormField } from '@/features/users/components/form-field';

function ProfilePage() {
  const { t } = useTranslation('profile');
  const { form, profile, isLoadingProfile, isSubmitting, onSubmit } =
    useProfileForm();
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const genderOptions = [
    { value: 'male', label: t('gender.male') },
    { value: 'female', label: t('gender.female') },
    { value: 'other', label: t('gender.other') },
    { value: 'prefer_not_to_say', label: t('gender.preferNot') },
  ] as const;

  const firstName = form.watch('first_name');
  const lastName = form.watch('last_name');
  const avatarUrl = form.watch('avatar_url');

  const initials = (() => {
    const a = firstName?.trim().charAt(0) || profile?.email?.charAt(0) || '?';
    const b = lastName?.trim().charAt(0) ?? '';
    return (a + b).toUpperCase();
  })();

  return (
    <div className="animate-account-fade-in-up space-y-10">
      <AccountSectionHeader
        icon={UserIcon}
        title={t('section.about')}
        description={t('about.description')}
      />

      <div className="flex items-center gap-5">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-600">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="size-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xl font-semibold text-neutral-100">
              {isLoadingProfile ? '...' : initials}
            </div>
          )}
        </div>
        <div>
          {isLoadingProfile ? (
            <div className="h-4 w-32 animate-pulse rounded bg-neutral-700" />
          ) : (
            <>
              <p className="font-medium text-neutral-100">
                {firstName} {lastName}
              </p>
              <p className="text-sm text-neutral-400">{profile?.email ?? ''}</p>
            </>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label={t('about.firstName')}
            htmlFor="first-name"
            error={errors.first_name?.message}
          >
            <Input
              id="first-name"
              disabled={isLoadingProfile}
              {...register('first_name')}
            />
          </FormField>
          <FormField
            label={t('about.lastName')}
            htmlFor="last-name"
            error={errors.last_name?.message}
          >
            <Input
              id="last-name"
              disabled={isLoadingProfile}
              {...register('last_name')}
            />
          </FormField>
        </div>

        <FormField label={t('about.email')} htmlFor="email">
          <Input
            id="email"
            value={profile?.email ?? ''}
            disabled
            className="cursor-not-allowed opacity-70"
            readOnly
          />
        </FormField>

        <FormField
          label={t('about.avatarUrl')}
          htmlFor="avatar-url"
          error={errors.avatar_url?.message}
        >
          <Input
            id="avatar-url"
            placeholder="https://..."
            disabled={isLoadingProfile}
            {...register('avatar_url')}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label={t('about.gender')}
            htmlFor="gender"
            error={errors.gender?.message}
          >
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={(value) =>
                    field.onChange(value === '' ? undefined : value)
                  }
                  disabled={isLoadingProfile}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder={t('about.genderPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            label={t('about.phone')}
            htmlFor="phone"
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              type="tel"
              placeholder="+1 555 0123"
              disabled={isLoadingProfile}
              {...register('phone')}
            />
          </FormField>
        </div>

        <FormField
          label={t('about.country')}
          htmlFor="country"
          error={errors.country?.message}
          hint={t('about.countryHint')}
        >
          <Input
            id="country"
            placeholder="US"
            maxLength={2}
            disabled={isLoadingProfile}
            {...register('country')}
          />
        </FormField>

        <FormField
          label={t('about.bio')}
          htmlFor="bio"
          error={errors.bio?.message}
        >
          <Textarea
            id="bio"
            rows={3}
            className="min-h-[88px]"
            disabled={isLoadingProfile}
            {...register('bio')}
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          className="rounded-full px-8 font-semibold"
          disabled={isSubmitting || isLoadingProfile}
        >
          {isSubmitting ? t('about.saving') : t('about.save')}
        </Button>
      </form>
    </div>
  );
}

export { ProfilePage };
export default ProfilePage;
