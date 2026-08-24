import type { Metadata } from "next";
import Link from "next/link";
import {
  SALON_ADDRESS,
  SALON_EMAIL,
  SALON_NAME,
  SALON_PHONE,
  SALON_PHONE_HREF,
} from "@/data/salon";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Valentin",
  description:
    "Политика обработки персональных данных салона Valentin в соответствии с 152-ФЗ.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-cashmere pt-[calc(5.5rem+env(safe-area-inset-top))] pb-16 md:pt-32 md:pb-24">
      <article className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brass">
          152-ФЗ
        </p>
        <h1 className="font-serif text-[2rem] text-graphite md:text-5xl">
          Политика конфиденциальности
        </h1>
        <p className="mt-4 text-sm text-graphite/55">
          Салон {SALON_NAME}, {SALON_ADDRESS}
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-graphite/75 md:text-[15px]">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-graphite">1. Общие положения</h2>
            <p>
              Настоящая политика определяет порядок обработки персональных данных
              посетителей сайта {SALON_NAME} и действует в соответствии с
              Федеральным законом № 152-ФЗ «О персональных данных».
            </p>
            <p>
              Оператор: салон мебели {SALON_NAME}. Контакты:{" "}
              <a className="text-brass hover:underline" href={`mailto:${SALON_EMAIL}`}>
                {SALON_EMAIL}
              </a>
              ,{" "}
              <a className="text-brass hover:underline" href={SALON_PHONE_HREF}>
                {SALON_PHONE}
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-graphite">2. Какие данные собираем</h2>
            <p>При отправке заявок с сайта мы можем получать:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>имя;</li>
              <li>номер телефона;</li>
              <li>комментарий к заявке и состав подборки;</li>
              <li>технические данные (IP, cookies) — для работы сайта и аналитики.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-graphite">3. Цели обработки</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>связь по заявке на консультацию, расчёт и заказ мебели;</li>
              <li>уточнение комплектации и сроков;</li>
              <li>улучшение работы сайта (при подключении аналитики).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-graphite">4. Правовые основания</h2>
            <p>
              Обработка выполняется на основании согласия субъекта персональных
              данных (отметка в форме на сайте) и для исполнения договора / преддоговорных
              отношений по запросу клиента.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-graphite">5. Передача третьим лицам</h2>
            <p>
              Данные не продаются. Они могут передаваться только сервисам,
              необходимым для работы сайта и связи (хостинг, почтовый сервис,
              мессенджеры по вашему выбору), в объёме, нужном для оказания услуги.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-graphite">6. Срок хранения</h2>
            <p>
              Заявки хранятся не дольше, чем нужно для обработки обращения и
              исполнения обязательств, либо до отзыва согласия, если иное не
              требуется законом.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-graphite">7. Права пользователя</h2>
            <p>
              Вы можете запросить уточнение, блокирование или удаление своих
              данных, а также отозвать согласие — напишите на {SALON_EMAIL} или
              позвоните по телефону салона.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl text-graphite">8. Cookies</h2>
            <p>
              Сайт может использовать cookies и похожие технологии для корректной
              работы интерфейса и (при наличии) веб-аналитики. Вы можете ограничить
              cookies в настройках браузера.
            </p>
          </section>
        </div>

        <p className="mt-12">
          <Link href="/" className="text-xs uppercase tracking-[0.16em] text-brass hover:text-graphite">
            ← На главную
          </Link>
        </p>
      </article>
    </main>
  );
}
