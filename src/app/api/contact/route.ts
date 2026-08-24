import { NextResponse } from "next/server";
import {
  isContactTopic,
  normalizePhone,
  type CartLine,
  type ContactPayload,
  type ContactTopic,
} from "@/lib/contact";
import { mailConfigured, sendContactMail } from "@/lib/mail";

const hits = new Map<string, number[]>();
const MAX_BODY = 48_000;

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || real?.trim() || "local";
}

function limited(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) {
    for (const [key, times] of hits) {
      const kept = times.filter((t) => now - t < windowMs);
      if (kept.length) hits.set(key, kept);
      else hits.delete(key);
    }
  }
  return false;
}

function str(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parseItems(value: unknown): CartLine[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  const items = value.slice(0, 40).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const name = str(item.name, 120);
    const id = str(item.id, 80);
    const quantity = Number(item.quantity);
    const priceFrom = Number(item.priceFrom);
    if (!name || !Number.isFinite(quantity) || quantity < 1) return [];
    return [
      {
        id: id || name,
        name,
        quantity: Math.min(99, Math.round(quantity)),
        priceFrom: Number.isFinite(priceFrom) ? Math.max(0, priceFrom) : 0,
      },
    ];
  });
  return items.length ? items : undefined;
}

export async function POST(request: Request) {
  if (limited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок. Позвоните нам или попробуйте позже." },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY) {
    return NextResponse.json({ ok: false, error: "Слишком большой запрос." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ ok: false, error: "Слишком большой запрос." }, { status: 413 });
    }
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос." }, { status: 400 });
  }

  if (str(body.company, 120)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name, 80);
  const phone = normalizePhone(str(body.phone, 32));
  const email = str(body.email, 120);
  const message = str(body.message, 2000);
  const topicRaw = str(body.topic, 32);
  const topic: ContactTopic = isContactTopic(topicRaw) ? topicRaw : "other";

  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Нужно согласие на обработку персональных данных." },
      { status: 400 }
    );
  }

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Укажите имя." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "Укажите телефон в формате +7…" },
      { status: 400 }
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Проверьте адрес почты." }, { status: 400 });
  }
  const items = parseItems(body.items);
  if (message.length < 5 && !items?.length) {
    return NextResponse.json(
      { ok: false, error: "Напишите, что нужно рассчитать." },
      { status: 400 }
    );
  }

  if (!mailConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Отправка временно недоступна. Позвоните +7 (920) 200-51-24 или напишите на valentinksalon@mail.ru",
      },
      { status: 503 }
    );
  }

  const payload: ContactPayload = {
    name,
    phone,
    email: email || undefined,
    topic,
    message:
      message ||
      (items?.length
        ? `Заявка по подборке: ${items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}`
        : ""),
    width: str(body.width, 20) || undefined,
    depth: str(body.depth, 20) || undefined,
    height: str(body.height, 20) || undefined,
    consent: true,
    items,
  };

  try {
    await sendContactMail(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact mail failed", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не удалось отправить заявку. Позвоните +7 (920) 200-51-24 или напишите на valentinksalon@mail.ru",
      },
      { status: 502 }
    );
  }
}
