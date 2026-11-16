"use client";
import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

// Render this only inside dynamic pages (after getSession()/connection()), not in the root layout:
// creating a store calls Math.random(), which cacheComponents forbids in prerendered (static) output.
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore); // created once per mount
  return <Provider store={store}>{children}</Provider>;
}
