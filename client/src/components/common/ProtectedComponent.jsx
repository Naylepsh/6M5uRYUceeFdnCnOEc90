import { useAppState } from "../../states/AppState";
import React from "react";

export function ProtectedComponent({ children }) {
  const [{ auth }] = useAppState();

  if (!auth) return null;
  return <React.Fragment>{children}</React.Fragment>;
}
