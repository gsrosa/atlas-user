import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  travelerProfileFormSchema,
  type TravelerProfileFormValues,
} from "@/features/traveler-profile/shared/schema";
import {
  clearDraft,
  loadDraft,
  saveDraft,
} from "@/features/traveler-profile/utils/draft-storage";

import { trpc } from "@/trpc/client";
import { type RouterInputs } from "@/trpc/types";

type PatchInput = RouterInputs["travelerProfile"]["patch"];

export const useTravelerProfileForm = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = trpc.travelerProfile.get.useQuery();
  const traverProfileQueryKey = getQueryKey(
    trpc.travelerProfile.get,
    undefined,
    "query",
  );

  const form = useForm<TravelerProfileFormValues>({
    resolver: zodResolver(travelerProfileFormSchema),
    defaultValues: loadDraft() as TravelerProfileFormValues,
  });

  const patch = trpc.travelerProfile.patch.useMutation({
    onSuccess: () => {
      clearDraft();
      window.dispatchEvent(
        new CustomEvent("nexploring:traveler-profile-updated"),
      );
      queryClient.invalidateQueries({ queryKey: traverProfileQueryKey });
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
      ...(data.preferences as TravelerProfileFormValues),
      ...(stored as TravelerProfileFormValues),
    });
  }, [data?.preferences]);

  React.useEffect(() => {
    // eslint-disable-next-line
    const { unsubscribe } = form.watch((values) => {
      saveDraft(values as Record<string, unknown>);
    });
    return unsubscribe;
  }, []);

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
