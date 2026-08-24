"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import {
  formatPrice,
  formatPriceFrom,
  softSpring,
  vipDeliveryThreshold,
} from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export function SideCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, addItem } =
    useCart();

  const [checkout, setCheckout] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useLockBodyScroll(isOpen);

  const remaining = Math.max(0, vipDeliveryThreshold - total);
  const progress = Math.min(100, (total / vipDeliveryThreshold) * 100);
  const cartIds = new Set(items.map((i) => i.product.id));
  const upsell = products.filter((p) => !cartIds.has(p.id)).slice(0, 2);

  const resetForm = () => {
    setCheckout(false);
    setName("");
    setPhone("");
    setNote("");
    setConsent(false);
    setError("");
    setSent(false);
    setSending(false);
  };

  const handleClose = () => {
    resetForm();
    closeCart();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0 || sending) return;
    setError("");
    setSending(true);

    const lines = items.map(
      ({ product, quantity }) =>
        `${product.name} × ${quantity} (${formatPriceFrom(product.priceFrom)})`,
    );
    const message =
      note.trim().length >= 5
        ? note.trim()
        : `Заявка на консультацию по подборке.\n${lines.join("\n")}\nИтого от ${formatPrice(total)}.`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          topic: "cart",
          message,
          consent,
          items: items.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            quantity,
            priceFrom: product.priceFrom,
          })),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Не удалось отправить заявку.");
        return;
      }
      setSent(true);
    } catch {
      setError("Сеть недоступна. Позвоните +7 (920) 200-51-24.");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Закрыть заявку"
            className="fixed inset-0 z-[60] bg-graphite/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Заявка"
            className="fixed inset-y-0 right-0 z-[70] flex h-[100dvh] w-full max-w-md flex-col bg-milk shadow-soft pt-[env(safe-area-inset-top)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={softSpring}
          >
            <div className="flex items-center justify-between border-b border-brass/20 px-6 py-5">
              <h2 className="font-serif text-2xl text-graphite">Заявка</h2>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-cashmere"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-brass/20 px-6 py-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-graphite/60">VIP-доставка и сборка</span>
                <span className="font-medium text-graphite">
                  {remaining === 0 ? "В подарок" : `ещё ${formatPrice(remaining)}`}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-cashmere shadow-insetSoft">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brass-soft to-brass shadow-[0_0_12px_rgba(61,36,24,0.35)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={softSpring}
                />
              </div>
              <p className="mt-2 text-xs text-graphite/50">
                {remaining === 0
                  ? "VIP-доставка и сборка — в подарок к заказу"
                  : "При заказе от порога — VIP-доставка и сборка в подарок"}
              </p>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-5">
              {sent ? (
                <div className="py-10 text-center">
                  <p className="font-serif text-2xl text-graphite">Заявка отправлена</p>
                  <p className="mt-3 text-sm leading-relaxed text-graphite/60">
                    Мы свяжемся с вами по телефону и уточним детали по позициям
                    из подборки.
                  </p>
                  <Button className="mt-8" fullWidth magnetic={false} onClick={handleClose}>
                    Закрыть
                  </Button>
                </div>
              ) : items.length === 0 ? (
                <p className="py-12 text-center text-sm text-graphite/50">
                  Подборка пуста. Выберите кухню, прихожую или диван — всё под заказ.
                </p>
              ) : (
                <ul className="space-y-5">
                  {items.map(({ product, quantity }) => (
                    <li key={product.id} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-milk">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-lg leading-tight">
                            {product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="rounded-full p-2 text-graphite/40 hover:bg-cashmere hover:text-graphite"
                            aria-label="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-graphite/60">
                          {formatPriceFrom(product.priceFrom)}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-brass/25 p-1">
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cashmere"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            aria-label="Уменьшить"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm">{quantity}</span>
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cashmere"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            aria-label="Увеличить"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!sent && upsell.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-xs uppercase tracking-[0.18em] text-graphite/45">
                    Вам подойдёт
                  </h3>
                  <div className="space-y-3">
                    {upsell.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 bg-cashmere/80 p-3"
                      >
                        <div className="relative h-14 w-12 overflow-hidden bg-milk">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-graphite/55">
                            {formatPriceFrom(product.priceFrom)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="!px-3 !py-2 text-xs"
                          magnetic={false}
                          onClick={() => addItem(product)}
                        >
                          Добавить
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!sent && checkout && items.length > 0 ? (
                <form id="cart-consult" onSubmit={onSubmit} className="mt-8 space-y-4 border-t border-brass/15 pt-6">
                  <p className="font-serif text-xl text-graphite">Консультация</p>
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-graphite/45">
                      Имя
                    </span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-brass/20 bg-milk px-3 py-2.5 text-graphite outline-none focus:border-brass/50"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-graphite/45">
                      Телефон
                    </span>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7…"
                      className="w-full border border-brass/20 bg-milk px-3 py-2.5 text-graphite outline-none focus:border-brass/50"
                      autoComplete="tel"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-graphite/45">
                      Комментарий
                    </span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Когда удобно позвонить, размеры комнаты…"
                      className="w-full resize-none border border-brass/20 bg-milk px-3 py-2.5 text-graphite outline-none focus:border-brass/50"
                    />
                  </label>
                  <ConsentCheckbox
                    id="cart-consent"
                    checked={consent}
                    onChange={setConsent}
                  />
                  {error ? (
                    <p className="text-sm text-red-700/80" role="alert">
                      {error}
                    </p>
                  ) : null}
                </form>
              ) : null}
            </div>

            {!sent ? (
              <div className="border-t border-brass/20 px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-graphite/55">Итого от</span>
                  <span className="font-serif text-2xl">{formatPrice(total)}</span>
                </div>
                {checkout ? (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      magnetic={false}
                      onClick={() => {
                        setCheckout(false);
                        setError("");
                      }}
                    >
                      Назад
                    </Button>
                    <Button
                      type="submit"
                      form="cart-consult"
                      fullWidth
                      magnetic={false}
                      disabled={items.length === 0 || sending || !consent}
                    >
                      {sending ? "Отправляем…" : "Отправить"}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      fullWidth
                      magnetic={false}
                      disabled={items.length === 0}
                      onClick={() => setCheckout(true)}
                    >
                      Оформить консультацию
                    </Button>
                    <p className="mt-2 text-center text-[11px] text-graphite/45">
                      Это не онлайн-оплата — менеджер перезвонит
                    </p>
                  </>
                )}
              </div>
            ) : null}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
