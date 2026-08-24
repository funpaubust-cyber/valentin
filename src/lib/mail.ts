import nodemailer from "nodemailer";
import {
  CONTACT_MAIL_SUBJECT,
  contactTopics,
  SALON_EMAIL,
  type ContactPayload,
} from "./contact";
import { formatPriceFrom } from "./utils";

function env(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

export function mailConfigured(): boolean {
  return Boolean(env("MAIL_USER") && env("MAIL_PASSWORD"));
}

function transporter() {
  const port = Number(env("MAIL_PORT", "465"));
  return nodemailer.createTransport({
    host: env("MAIL_HOST", "smtp.mail.ru"),
    port,
    secure: port === 465,
    auth: {
      user: env("MAIL_USER", SALON_EMAIL),
      pass: env("MAIL_PASSWORD"),
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;width:38%;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b4a3a;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e8e0d4;font-size:15px;color:#1e1e1e;">${value}</td>
    </tr>`;
}

export async function sendContactMail(payload: ContactPayload) {
  const to = env("MAIL_TO", SALON_EMAIL);
  const fromUser = env("MAIL_USER", SALON_EMAIL);
  const sizes = [payload.width, payload.depth, payload.height]
    .map((v) => v?.trim())
    .filter(Boolean)
    .join(" × ");

  const items = payload.items ?? [];
  const cartHtml = items.length
    ? `<p style="margin:22px 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b4a3a;">Подборка</p>
       <table style="width:100%;border-collapse:collapse;">
         ${items
           .map(
             (item) =>
               row(
                 escapeHtml(item.name),
                 escapeHtml(
                   `${item.quantity} × ${formatPriceFrom(item.priceFrom)}`
                 )
               )
           )
           .join("")}
       </table>`
    : "";

  const cartText = items.length
    ? [
        "",
        "Подборка:",
        ...items.map(
          (item) =>
            `— ${item.name} × ${item.quantity} (${formatPriceFrom(item.priceFrom)})`
        ),
      ]
    : [];

  const html = `
  <div style="background:#F4F1EA;padding:28px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;background:#FAF9F5;border:1px solid rgba(61,36,24,.18);padding:28px;">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#6b4a3a;">Valentin</p>
      <h1 style="margin:0 0 22px;font-size:26px;font-weight:500;color:#1e1e1e;">Новое сообщение с сайта</h1>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Тема", escapeHtml(contactTopics[payload.topic]))}
        ${row("Имя", escapeHtml(payload.name))}
        ${row("Телефон", `<a href="tel:${escapeHtml(payload.phone)}" style="color:#3d2418;text-decoration:none;">${escapeHtml(payload.phone)}</a>`)}
        ${payload.email ? row("Почта", `<a href="mailto:${escapeHtml(payload.email)}" style="color:#3d2418;">${escapeHtml(payload.email)}</a>`) : ""}
        ${sizes ? row("Размеры, см", escapeHtml(sizes)) : ""}
      </table>
      ${cartHtml}
      <p style="margin:22px 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b4a3a;">Сообщение</p>
      <p style="margin:0;white-space:pre-wrap;line-height:1.6;color:#1e1e1e;font-size:15px;">${escapeHtml(payload.message)}</p>
    </div>
  </div>`;

  const text = [
    CONTACT_MAIL_SUBJECT,
    `Тема: ${contactTopics[payload.topic]}`,
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    payload.email ? `Почта: ${payload.email}` : "",
    sizes ? `Размеры, см: ${sizes}` : "",
    ...cartText,
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  await transporter().sendMail({
    from: `"Valentin" <${fromUser}>`,
    to,
    replyTo: payload.email || undefined,
    subject: CONTACT_MAIL_SUBJECT,
    text,
    html,
  });
}
