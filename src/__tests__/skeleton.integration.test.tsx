import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UserAppSkeleton from "@/skeleton";

vi.mock(
  "@/features/user-preferences/components/user-preferences-form-page-skeleton",
  () => ({
    UserPreferencesFormPageSkeleton: () => <div>Onboarding skeleton</div>,
  }),
);

vi.mock(
  "@/features/user-preferences/components/user-preferences-settings-page-skeleton",
  () => ({
    UserPreferencesSettingsPageSkeleton: () => (
      <div>Profile settings skeleton</div>
    ),
  }),
);

const setPath = (pathname: string) => {
  window.history.pushState({}, "", pathname);
};

describe("UserAppSkeleton (integration)", () => {
  beforeEach(() => {
    setPath("/");
  });

  it("should show the onboarding skeleton when the path is /profile/onboarding", () => {
    setPath("/profile/onboarding");
    render(<UserAppSkeleton />);
    expect(screen.getByText("Onboarding skeleton")).toBeInTheDocument();
  });

  it("should show the profile settings skeleton when the path is /profile", () => {
    setPath("/profile");
    render(<UserAppSkeleton />);
    expect(screen.getByText("Profile settings skeleton")).toBeInTheDocument();
  });

  it("should show the profile settings skeleton when the path is /profile/settings", () => {
    setPath("/profile/settings");
    render(<UserAppSkeleton />);
    expect(screen.getByText("Profile settings skeleton")).toBeInTheDocument();
  });
});
