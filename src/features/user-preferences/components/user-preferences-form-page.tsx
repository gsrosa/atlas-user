import React from "react";

import { Button, cn } from "@gsrosa/nexploring-ui";
import { ChevronRightIcon } from "lucide-react";
import { Controller } from "react-hook-form";

import { useUserPreferencesForm } from "@/features/user-preferences/hooks/use-user-preferences-form";
import {
  PROFILE_QUESTIONS,
  PROFILE_SECTIONS,
} from "@/features/user-preferences/shared/constants";
import { canProceedSection } from "@/features/user-preferences/shared/form-validation";
import type { UserPreferencesFormValues } from "@/features/user-preferences/shared/schema";

import { QuestionBlock } from "./question-block";

const GROUPED = PROFILE_SECTIONS.map((sec) => ({
  ...sec,
  steps: PROFILE_QUESTIONS.filter((s) => s.sectionIndex === sec.index),
}));

export const UserPreferencesFormPage = () => {
  const { form, isLoading, isEditing, isPending, isSuccess, handleFormSubmit } =
    useUserPreferencesForm();
  const { control, watch } = form;

  const [sectionIdx, setSectionIdx] = React.useState(0);
  const [direction, setDirection] = React.useState<"forward" | "back">(
    "forward",
  );

  const total = GROUPED.length;
  const section = GROUPED[sectionIdx]!;
  const isFirst = sectionIdx === 0;
  const isLast = sectionIdx === total - 1;

  const values = watch();
  const canProceed = canProceedSection(section.steps, values);

  const handleBack = () => {
    if (isFirst) return;
    setDirection("back");
    setSectionIdx((i) => i - 1);
  };

  const handleNext = () => {
    if (!isLast) {
      setDirection("forward");
      setSectionIdx((i) => i + 1);
      return;
    }
    void handleFormSubmit();
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-6xl">{isEditing ? "✅" : "🎉"}</span>
        <h1 className="font-display max-w-md text-2xl font-semibold text-neutral-100 sm:text-3xl">
          {isEditing
            ? "Preferences updated."
            : "Atlas knows how you travel now."}
        </h1>
        <p className="max-w-sm text-sm text-neutral-400">
          {isEditing
            ? "Your changes are saved. They'll shape every trip plan from here on."
            : "Every trip plan will be tuned to your style. You can come back and adjust anything at any time."}
        </p>
        <Button variant="primary" size="lg" asChild>
          <a
            href={isEditing ? "/profile/settings" : "/"}
            className="no-underline"
          >
            {isEditing ? "Back to preferences" : "Start planning"}
          </a>
        </Button>
        {!isEditing && (
          <a
            href="/profile/settings"
            className="text-xs text-neutral-400 underline-offset-4 hover:underline"
          >
            View profile settings
          </a>
        )}
      </div>
    );
  }

  if (isLoading && Object.keys(values).length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-neutral-900 text-neutral-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col text-neutral-100">
      <main className="flex flex-1 flex-col items-center px-6 pb-16 pt-12">
        <div
          key={section.index}
          className={cn(
            "w-full max-w-2xl animate-in fade-in duration-400",
            direction === "forward"
              ? "slide-in-from-right-4"
              : "slide-in-from-left-4",
          )}
        >
          <div className="mb-10 text-center">
            <span className="mb-4 block text-5xl">{section.icon}</span>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-100 md:text-4xl">
              {section.title}
            </h1>
            <p className="mt-2 font-sans text-sm text-neutral-400">
              {section.subtitle}
            </p>
          </div>

          <div className="space-y-10">
            {section.steps.map((step) => (
              <Controller
                key={step.field}
                control={control}
                name={step.field as keyof UserPreferencesFormValues}
                render={({ field }) => (
                  <QuestionBlock
                    step={step}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-between">
            <Button
              onClick={handleBack}
              disabled={isFirst}
              variant="ghost"
              size="lg"
              className={cn(
                isFirst
                  ? "cursor-not-allowed text-neutral-400/30"
                  : "text-neutral-400 hover:text-neutral-100",
              )}
            >
              ← Back
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!canProceed || isPending}
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {isLast
                ? isEditing
                  ? "Save changes"
                  : "Save profile"
                : "Continue"}
              {!isLast && (
                <ChevronRightIcon aria-hidden size={16} strokeWidth={2.5} />
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
