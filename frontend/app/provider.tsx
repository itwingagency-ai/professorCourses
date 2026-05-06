"use client";

import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "../redux/store";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";

interface ProviderProps {
  children: React.ReactNode;
}

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { authChecked } = useSelector((state: any) => state.auth);

  const { isLoading } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (!authChecked && isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export function Providers({ children }: ProviderProps) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
