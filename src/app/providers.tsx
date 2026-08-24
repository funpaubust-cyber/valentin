"use client";

import { type ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { SideCart } from "@/components/modules/SideCart";
import { ChatWidget } from "@/components/modules/ChatWidget";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SmoothScroll>
        {children}
        <SideCart />
        <ChatWidget />
      </SmoothScroll>
    </CartProvider>
  );
}
