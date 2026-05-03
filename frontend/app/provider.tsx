/* eslint-disable @typescript-eslint/no-unused-vars */
// Disables the ESLint rule for unused variables

// Import React and Provider from react-redux to make Redux store accessible
import React from "react";
import { Provider } from "react-redux";

// Import the configured Redux store
import { store } from "../redux/store";

// Define a TypeScript interface for component props
interface ProviderProps {
    children: React.ReactNode;  // Accepts any valid React nodes as children
}

// Define the Providers component, a wrapper for the Redux Provider
export function Providers ({ children }: ProviderProps) {
    // Render the Redux Provider with the store and wrap all child components
    return <Provider store={store}>{children}</Provider>;
}
