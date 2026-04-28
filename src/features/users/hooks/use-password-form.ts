import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/features/users/shared/form-validation";

import { trpc } from "@/trpc/client";

export function usePasswordForm() {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePassword = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Password updated successfully");
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = form.handleSubmit((values) => {
    changePassword.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  });

  return { form, isSubmitting: changePassword.isPending, onSubmit };
}
