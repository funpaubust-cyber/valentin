"use client";

import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export function ProductActions({ product }: { product: Product }) {
  const { addItem, openCart, items } = useCart();

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button fullWidth magnetic={false} onClick={() => addItem(product)}>
        В заявку
      </Button>
      <Button
        fullWidth
        variant="outline"
        magnetic={false}
        onClick={() => {
          if (!items.some((i) => i.product.id === product.id)) {
            addItem(product);
          } else {
            openCart();
          }
        }}
      >
        Оформить консультацию
      </Button>
    </div>
  );
}
