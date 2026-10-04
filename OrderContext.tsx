"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import OrderModal from "./OrderModal";

const Ctx = createContext<{ open: (pkg?: string) => void }>({ open: () => {} });
export const useOrder = () => useContext(Ctx);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [s, set] = useState<{ open: boolean; pkg?: string; k: number }>({ open: false, k: 0 });
  return (
    <Ctx.Provider value={{ open: (pkg) => set((p) => ({ open: true, pkg, k: p.k + 1 })) }}>
      {children}
      {s.open && <OrderModal key={s.k} pkg={s.pkg} onClose={() => set((p) => ({ ...p, open: false }))} />}
    </Ctx.Provider>
  );
}

export function OrderButton({ pkg, className = "", children }: { pkg?: string; className?: string; children: ReactNode }) {
  const { open } = useOrder();
  return <button type="button" onClick={() => open(pkg)} className={className}>{children}</button>;
}
