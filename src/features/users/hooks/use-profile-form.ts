import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  type ProfileFormValues,
  profileSchema,
} from "@/features/users/shared/form-validation";

import { trpc } from "@/trpc/client";

export function useProfileForm() {
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingProfile } = trpc.users.me.useQuery();
  const profile = data?.profile ?? null;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: undefined,
      phone: "",
      bio: "",
      country: "",
      avatar_url: "",
    },
  });

  React.useEffect(() => {
    if (!profile) return;
    form.reset({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      gender: (profile.gender as ProfileFormValues["gender"]) ?? undefined,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
      country: profile.country ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
  }, [profile, form]);

  const updateMe = trpc.users.updateMe.useMutation({
    onSuccess: ({ profile: updated }) => {
      toast.success("Profile updated successfully");
      queryClient.setQueryData(
        getQueryKey(trpc.users.me),
        (prev: { profile: unknown } | undefined) =>
          prev ? { ...prev, profile: updated } : prev,
      );
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = form.handleSubmit((values) => {
    updateMe.mutate({
      first_name: values.first_name || undefined,
      last_name: values.last_name || undefined,
      gender: values.gender,
      phone: values.phone,
      bio: values.bio,
      country: values.country || undefined,
      avatar_url: values.avatar_url,
    });
  });

  return {
    form,
    profile,
    isLoadingProfile,
    isSubmitting: updateMe.isPending,
    onSubmit,
  };
}
