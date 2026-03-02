"use client";

import { Web3Provider } from "@/wagmi.tsx";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}
