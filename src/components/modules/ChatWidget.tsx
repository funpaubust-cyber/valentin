"use client";

import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MessageCircle, X } from "lucide-react";
import { SALON_PHONE_HREF } from "@/data/salon";

const VK_GROUP_ID = 143735775;
const SCRIPT_ID = "vk-openapi";
const HOST_ID = "vk_community_messages";

type VkWidget = {
  expand: (cb?: () => void) => void;
  minimize: (cb?: () => void) => void;
  destroy?: (cb?: () => void) => void;
};

type VkApi = {
  Widgets: {
    CommunityMessages: (
      el: string,
      groupId: number,
      options?: Record<string, unknown>,
    ) => VkWidget;
  };
};

declare global {
  interface Window {
    VK?: VkApi;
  }
}

function loadOpenApi(): Promise<VkApi> {
  if (window.VK?.Widgets) return Promise.resolve(window.VK);

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.VK?.Widgets) resolve(window.VK);
        else reject(new Error("VK Open API не загрузился"));
      });
      existing.addEventListener("error", () =>
        reject(new Error("Не удалось загрузить VK Open API")),
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://vk.com/js/api/openapi.js?169";
    script.async = true;
    script.onload = () => {
      if (window.VK?.Widgets) resolve(window.VK);
      else reject(new Error("VK Open API не загрузился"));
    };
    script.onerror = () => reject(new Error("Не удалось загрузить VK Open API"));
    document.body.appendChild(script);
  });
}

function setChatOpenClass(open: boolean) {
  document.documentElement.classList.toggle("vk-chat-open", open);
}

function isDomWidgetError(text: string) {
  return /removeChild|insertBefore|NotFoundError|The node to be removed/i.test(
    text,
  );
}

/** ВК двигает iframe сам — без этого React падает белым экраном при закрытии. */
function useVkDomGuard() {
  useEffect(() => {
    const proto = Node.prototype;
    const removeChild = proto.removeChild;
    const insertBefore = proto.insertBefore;

    proto.removeChild = function <T extends Node>(this: Node, child: T): T {
      try {
        if (child.parentNode !== this) return child;
        return removeChild.call(this, child) as T;
      } catch {
        return child;
      }
    };

    proto.insertBefore = function <T extends Node>(
      this: Node,
      newNode: T,
      refNode: Node | null,
    ): T {
      try {
        if (refNode && refNode.parentNode !== this) {
          return this.appendChild(newNode) as T;
        }
        return insertBefore.call(this, newNode, refNode) as T;
      } catch {
        return newNode;
      }
    };

    const onError = (event: ErrorEvent) => {
      const text = `${event.message} ${event.error ?? ""}`;
      if (!isDomWidgetError(text)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    window.addEventListener("error", onError, true);

    return () => {
      proto.removeChild = removeChild;
      proto.insertBefore = insertBefore;
      window.removeEventListener("error", onError, true);
    };
  }, []);
}

class ChatErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("ChatWidget recovered", error, info.componentStack);
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-50 sm:right-6">
          <a
            href={SALON_PHONE_HREF}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-wood text-milk shadow-[0_16px_40px_rgba(40,24,16,0.28)]"
            aria-label="Позвонить в салон"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

function ChatWidgetInner() {
  const widgetRef = useRef<VkWidget | null>(null);
  const bootingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(true);
  const [error, setError] = useState("");

  useVkDomGuard();

  useEffect(() => {
    setChatOpenClass(open && !error);
    return () => setChatOpenClass(false);
  }, [open, error]);

  const bootWidget = useCallback(async () => {
    if (widgetRef.current || bootingRef.current) return;
    bootingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const vk = await loadOpenApi();
      if (!document.getElementById(HOST_ID)) {
        throw new Error("Нет контейнера виджета ВК");
      }

      widgetRef.current = vk.Widgets.CommunityMessages(HOST_ID, VK_GROUP_ID, {
        expanded: 1,
        widgetPosition: "right",
        buttonType: "no_button",
        disableButtonTooltip: 1,
        welcomeScreen: 0,
        // Не ставим свой error на onCanNotWrite: у гостя виджет сам рисует «Войти».
        onMinimize: () => {
          setOpen(false);
        },
      });
    } catch {
      widgetRef.current = null;
      const host = document.getElementById(HOST_ID);
      if (host) host.innerHTML = "";
      setError(
        "Не удалось загрузить чат на странице. Позвоните +7 (920) 200-51-24.",
      );
    } finally {
      bootingRef.current = false;
      setLoading(false);
    }
  }, []);

  const openChat = useCallback(() => {
    setHint(false);
    setOpen(true);
    setError("");

    const host = document.getElementById(HOST_ID);
    const frameAlive = Boolean(host?.querySelector("iframe"));
    if (!frameAlive) {
      widgetRef.current = null;
      if (host) host.innerHTML = "";
    }

    if (widgetRef.current) {
      try {
        widgetRef.current.expand();
      } catch {
        /* уже открыт */
      }
      return;
    }

    void bootWidget();
  }, [bootWidget]);

  const closeChat = useCallback(() => {
    setOpen(false);
    setError("");
    try {
      widgetRef.current?.minimize();
    } catch {
      /* виджет уже закрыт */
    }
  }, []);

  return (
    <>
      {/* Единый блок: шапка + HOST_ID всегда в DOM вместе, никогда не разъезжаются */}
      <div className={`vk-chat-panel${open && !error ? " vk-chat-panel--open" : ""}`}>
        <div className="vk-chat-panel-header">
          <div>
            <p className="font-serif text-lg text-milk">Чат ВКонтакте</p>
            <p className="text-xs text-milk/60">салон Valentin</p>
          </div>
          <button
            type="button"
            onClick={closeChat}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-milk/20 text-milk transition hover:bg-milk/10"
            aria-label="Закрыть чат"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading && open && !error ? (
          <div className="bg-[#faf9f5] px-4 py-5 text-sm text-graphite/55">
            Подключаем сообщения сообщества…
          </div>
        ) : null}

        <div id={HOST_ID} className="vk-chat-host" aria-hidden={!open || Boolean(error)} />
      </div>

      {/* Кнопка + подсказки */}
      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-[82] flex flex-col items-end gap-3 sm:right-6">
        {open && error ? (
          <div className="w-[min(22rem,calc(100vw-2rem))] space-y-3 rounded-[1.2rem] border border-brass/20 bg-milk px-4 py-5 text-sm leading-relaxed text-graphite/70 shadow-[0_16px_40px_rgba(40,24,16,0.12)]">
            <p>{error}</p>
            <a
              href={SALON_PHONE_HREF}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-wood px-4 text-xs uppercase tracking-[0.14em] text-milk"
            >
              Позвонить
            </a>
          </div>
        ) : null}

        {hint && !open ? (
          <div className="hidden max-w-[16rem] rounded-[1.2rem] border border-brass/20 bg-milk px-4 py-3 text-sm text-graphite shadow-[0_16px_40px_rgba(40,24,16,0.12)] sm:block">
            Напишите нам в ВК — подберём кухню или диван
          </div>
        ) : null}

        <button
          type="button"
          onClick={open ? closeChat : openChat}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-wood text-milk shadow-[0_16px_40px_rgba(40,24,16,0.28)] transition hover:-translate-y-0.5"
          aria-label={open ? "Закрыть чат" : "Написать в ВКонтакте"}
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}

export function ChatWidget() {
  return (
    <ChatErrorBoundary>
      <ChatWidgetInner />
    </ChatErrorBoundary>
  );
}
