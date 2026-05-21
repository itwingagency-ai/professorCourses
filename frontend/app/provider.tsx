"use client";

import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "../redux/store";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";

interface ProviderProps {
  children: React.ReactNode;
}

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { authChecked } = useSelector((state: any) => state.auth);

  // refetchOnMountOrArgChange MUST be false here.
  // Setting it to true caused loadUser to re-fire on every page navigation
  // (AuthInitializer lives in the root layout and re-mounts between routes).
  // Combined with apiSlice.util.resetApiState() in the old logout handler,
  // this created a race where UserLoggedOut() fired mid-navigation, making
  // role guards think the user was unauthenticated and redirecting to "/".
  const { isLoading } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  if (!authChecked && isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export function Providers({ children }: ProviderProps) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthInitializer>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </AuthInitializer>
        </ThemeProvider>
      </SessionProvider>
    </Provider>
  );
}
