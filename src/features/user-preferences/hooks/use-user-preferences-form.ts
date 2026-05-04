import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  userPreferencesFormSchema,
  type UserPreferencesFormValues,
} from "@/features/user-preferences/shared/schema";
import {
  clearDraft,
  loadDraft,
  saveDraft,
} from "@/features/user-preferences/utils/draft-storage";

import { trpc } from "@/trpc/client";
import { type RouterInputs } from "@/trpc/types";

type PatchInput = RouterInputs["travelerProfile"]["patch"];

export const useUserPreferencesForm = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = trpc.travelerProfile.get.useQuery();
  const travelerProfileQueryKey = getQueryKey(
    trpc.travelerProfile.get,
    undefined,
    "query",
  );

  const form = useForm<UserPreferencesFormValues>({
    resolver: zodResolver(userPreferencesFormSchema),
    defaultValues: loadDraft() as UserPreferencesFormValues,
  });

  const patch = trpc.travelerProfile.patch.useMutation({
    onSuccess: () => {
      clearDraft();
      window.dispatchEvent(
        new CustomEvent("nexploring:traveler-profile-updated"),
      );
      queryClient.invalidateQueries({ queryKey: travelerProfileQueryKey });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Could not save preferences",
      );
    },
  });

  React.useEffect(() => {
    if (!data?.preferences) return;
    const stored = loadDraft();
    form.reset({
      ...(data.preferences as UserPreferencesFormValues),
      ...(stored as UserPreferencesFormValues),
    });
  }, [data?.preferences, form]);

  React.useEffect(() => {
    // eslint-disable-next-line
    const { unsubscribe } = form.watch((values) => {
      saveDraft(values as Record<string, unknown>);
    });
    return unsubscribe;
  }, [form]);

  const handleFormSubmit = form.handleSubmit((values) => {
    patch.mutate(values as PatchInput);
  });

  return {
    form,
    isLoading,
    isEditing: Boolean(data?.tier1Complete),
    isPending: patch.isPending,
    isSuccess: patch.isSuccess,
    handleFormSubmit,
  };
};
