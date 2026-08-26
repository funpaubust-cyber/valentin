"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import {
  SALON_EMAIL,
  SALON_HOURS_LABEL,
  SALON_PHONE,
  SALON_PHONE_HREF,
  openVkMessenger,
} from "@/data/salon";

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.049 2.303 3.847 2.896 3.847.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.181-3.626 2.181-3.626.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" />
    </svg>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const rowClass =
    "flex items-center gap-3 rounded-full border border-brass/20 bg-milk px-4 py-3 text-left transition-colors duration-300 ease-premium hover:border-brass/45";

  return (
    <div
      ref={rootRef}
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-[90] flex flex-col items-end sm:right-6"
    >
      <div
        role="dialog"
        aria-label="Связаться с салоном Valentin"
        aria-hidden={!open}
        className={`mb-3 w-[min(20rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-[1.35rem] border border-brass/25 shadow-[0_24px_60px_rgba(40,24,16,0.28)] transition-all duration-300 ease-premium ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-3 bg-wood px-4 py-3.5">
          <div>
            <p className="font-serif text-lg leading-tight text-milk">
              Написать в салон
            </p>
            <p className="mt-0.5 text-xs text-milk/55">
              Подберём кухню, прихожую или диван
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="-mr-1 -mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-milk/20 text-milk transition-colors hover:bg-milk/10"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 bg-cashmere p-3">
          <button
            type="button"
            onClick={() => {
              openVkMessenger();
              setOpen(false);
            }}
            tabIndex={open ? 0 : -1}
            className="flex w-full items-center gap-3 rounded-full bg-wood px-4 py-3 text-left transition-[filter] duration-300 ease-premium hover:brightness-110"
          >
            <VkIcon className="h-5 w-5 shrink-0 text-milk" />
            <span className="flex flex-col">
              <span className="text-sm text-milk">Чат ВКонтакте</span>
              <span className="text-xs text-milk/50">Ответим в сообщениях</span>
            </span>
          </button>

          <a
            href={`mailto:${SALON_EMAIL}`}
            tabIndex={open ? 0 : -1}
            className={rowClass}
          >
            <Mail className="h-4 w-4 shrink-0 text-brass" />
            <span className="flex flex-col">
              <span className="text-sm text-graphite">Почта</span>
              <span className="text-xs text-graphite/50">{SALON_EMAIL}</span>
            </span>
          </a>

          <a
            href={SALON_PHONE_HREF}
            tabIndex={open ? 0 : -1}
            className={rowClass}
          >
            <Phone className="h-4 w-4 shrink-0 text-brass" />
            <span className="flex flex-col">
              <span className="text-sm text-graphite">Позвонить</span>
              <span className="text-xs text-graphite/50">{SALON_PHONE}</span>
            </span>
          </a>

          <p className="pt-1 text-center text-[11px] uppercase tracking-[0.14em] text-graphite/40">
            {SALON_HOURS_LABEL}
          </p>
        </div>
      </div>

      {hint && !open ? (
        <div className="mb-3 hidden max-w-[15rem] rounded-[1.2rem] border border-brass/20 bg-milk px-4 py-3 text-sm text-graphite shadow-[0_16px_40px_rgba(40,24,16,0.12)] sm:block">
          Напишите нам — подберём кухню или диван
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setHint(false);
          setOpen((value) => !value);
        }}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-wood text-milk shadow-[0_16px_40px_rgba(40,24,16,0.28)] transition-transform duration-300 ease-premium hover:-translate-y-0.5"
        aria-label={open ? "Закрыть" : "Связаться с салоном"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
