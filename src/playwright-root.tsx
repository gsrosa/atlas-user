import React from 'react';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { PasswordPage } from '@/features/password';
import { ProfilePage } from '@/features/profile';
import { UserPreferencesFormPage, UserPreferencesPage } from '@/features/user-preferences';
import { AccountLayout } from '@/features/users';
import ProfileLayout from '@/features/users/profile-layout';

import { TrpcProvider } from '@/providers/trpc-provider';

/**
 * Router harness for Playwright only (`VITE_PLAYWRIGHT=1`).
 * Mirrors shell profile URLs + standalone App paths used by `App.tsx`.
 */
export const PlaywrightRoot = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="profile">
            <Route
              path="onboarding"
              element={
                <TrpcProvider>
                  <UserPreferencesFormPage />
                </TrpcProvider>
              }
            />
            <Route
              path="settings"
              element={
                <TrpcProvider>
                  <AccountLayout initialSection="preferences" />
                </TrpcProvider>
              }
            />
            <Route
              path="wrapped-account"
              element={
                <TrpcProvider>
                  <AccountLayout />
                </TrpcProvider>
              }
            />

            <Route element={<ProfileLayout />}>
              <Route index element={<Navigate to="about" replace />} />
              <Route path="about" element={<ProfilePage />} />
              <Route path="password" element={<PasswordPage />} />
              <Route path="preferences" element={<UserPreferencesPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};
