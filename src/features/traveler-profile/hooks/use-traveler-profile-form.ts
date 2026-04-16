import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { RouterInputs } from "@/lib/trpc"
import { trpc } from "@/lib/trpc"

import { travelerProfileFormSchema, type TravelerProfileFormValues } from "@/features/traveler-profile/shared/schema"
import { clearDraft, loadDraft, saveDraft } from "@/features/traveler-profile/utils/draft-storage"

type PatchInput = RouterInputs["travelerProfile"]["patch"]

export const useTravelerProfileForm = () => {
  const utils = trpc.useUtils()
  const { data, isLoading } = trpc.travelerProfile.get.useQuery()

  const form = useForm<TravelerProfileFormValues>({
    resolver: zodResolver(travelerProfileFormSchema),
    defaultValues: loadDraft() as TravelerProfileFormValues,
  })

  const patch = trpc.travelerProfile.patch.useMutation({
    onSuccess: () => {
      clearDraft()
      window.dispatchEvent(new CustomEvent("atlas:traveler-profile-updated"))
      void utils.travelerProfile.get.invalidate()
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not save preferences")
    },
  })

  React.useEffect(() => {
    if (!data?.preferences) return
    const stored = loadDraft()
    form.reset({ ...(data.preferences as TravelerProfileFormValues), ...(stored as TravelerProfileFormValues) })
  }, [data?.preferences])

  React.useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      saveDraft(values as Record<string, unknown>)
    })
    return unsubscribe
  }, [])

  const handleFormSubmit = form.handleSubmit((values) => {
    patch.mutate(values as PatchInput)
  })

  return {
    form,
    isLoading,
    isEditing: Boolean(data?.tier1Complete),
    isPending: patch.isPending,
    isSuccess: patch.isSuccess,
    handleFormSubmit,
  }
}
